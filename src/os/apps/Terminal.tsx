import { useEffect, useRef, useState } from "react";
import { useOS } from "../store";
import { byId, apps } from "../registry";
import { projects } from "@/content/projects";
import { identity } from "@/content/identity";
import { useSettings, type ThemeName } from "../settings";
import { useSession } from "../services/session";
import { useWallpaper, WALLPAPERS, type WallpaperId } from "../services/wallpaper";
import { notify, useNotifications } from "../services/notifications";

type Out =
  | { kind: "text"; lines: string[] }
  | { kind: "html"; node: React.ReactNode };

type Cmd = {
  name: string;
  aliases?: string[];
  desc: string;
  run: (args: string[], ctx: Ctx) => Out | void | Promise<Out | void>;
};

type Ctx = {
  print: (lines: string | string[]) => void;
  os: ReturnType<typeof useOS.getState>;
  settings: ReturnType<typeof useSettings.getState>;
  clear: () => void;
};

function table(rows: (string | number)[][], header?: string[]): string[] {
  const all = header ? [header, ...rows] : rows;
  const widths = all[0].map((_, ci) => Math.max(...all.map((r) => String(r[ci] ?? "").length)));
  return all.map((r, i) => r.map((c, ci) => String(c ?? "").padEnd(widths[ci] + 2)).join("") + (i === 0 && header ? "" : ""));
}

// Fake File System
let vfs: Record<string, string[]> = {
  "/": ["home", "etc", "var", "usr", "bin"],
  "/etc": ["passwd", "hosts", "resolv.conf"],
  "/var": ["log", "tmp"],
  "/usr": ["local", "share"],
  "/bin": ["bash", "sh", "zsh", "cat", "ls"],
  "/home": ["divy"],
  "/home/divy": ["projects", "documents", "downloads", "desktop", "resume.pdf", ".zshrc", ".ssh"],
  "/home/divy/projects": ["DivyOS", "api", "website", "experiments"],
  "/home/divy/documents": ["notes.txt", "ideas.md"],
  "/home/divy/.ssh": ["id_rsa.pub", "known_hosts"],
};
let vfsFiles: Record<string, string> = {
  "/home/divy/resume.pdf": "PDF-1.4... (Use `resume` command to open properly)",
  "/home/divy/.zshrc": "export PATH=$PATH:/usr/local/bin\nalias ll='ls -la'\nalias gs='git status'",
  "/home/divy/documents/notes.txt": "1. Build an OS in the browser\n2. Make it fast\n3. ???\n4. Profit",
  "/home/divy/documents/ideas.md": "# Ideas\n- Implement window snapping\n- Add a terminal\n- Add fake file system (done!)",
  "/etc/passwd": "root:x:0:0:root:/root:/bin/bash\ndivy:x:1000:1000:divy,,,:/home/divy:/bin/zsh",
  "/etc/hosts": "127.0.0.1 localhost\n127.0.1.1 divyos.local",
};
let cwd = "/home/divy";

function resolvePath(p: string): string {
  if (p === "/") return "/";
  if (p.startsWith("/")) return p.replace(/\/+$/, "");
  if (p === "~") return "/home/divy";
  if (p === ".") return cwd;
  if (p === "..") {
    const parts = cwd.split("/");
    parts.pop();
    return parts.length <= 1 ? "/" : parts.join("/");
  }
  return (cwd === "/" ? "/" : cwd + "/") + p;
}

const COMMANDS: Cmd[] = [
  { name: "help", aliases: ["?"], desc: "list commands",
    run: () => ({ kind: "text", lines: [
      "DivyOS shell — type `<cmd> --help` for details. Try:",
      "",
      ...COMMANDS.map((c) => `  ${c.name.padEnd(14)} ${c.desc}`),
      "",
      "aliases: ll, .., cls, q, ?, g, p, r, t",
    ]}),
  },
  { name: "clear", aliases: ["cls"], desc: "clear screen", run: (_, ctx) => { ctx.clear(); } },
  { name: "echo", desc: "echo text", run: (a) => ({ kind: "text", lines: [a.join(" ")] }) },
  { name: "whoami", desc: "current user", run: () => ({ kind: "text", lines: [identity.handle] }) },
  { name: "uname", desc: "system name", run: () => ({ kind: "text", lines: ["DivyOS 1.0 cortex x86_64"] }) },
  { name: "uptime", desc: "session uptime", run: () => ({ kind: "text", lines: [`up ${Math.floor(performance.now()/1000)}s`] }) },
  { name: "date", desc: "current date", run: () => ({ kind: "text", lines: [new Date().toString()] }) },
  { name: "history", desc: "command history", run: (_, ctx) => {
    const h = JSON.parse(localStorage.getItem("divyos:term:hist") || "[]") as string[];
    return { kind: "text", lines: h.map((c, i) => `  ${String(i+1).padStart(3," ")}  ${c}`) };
  }},
  { name: "apps", desc: "list apps", run: () => ({ kind: "text", lines: apps.map((a) => `  ${a.glyph}  ${a.id.padEnd(12)} ${a.description}`) }) },
  { name: "open", desc: "open <app>", run: (a, ctx) => {
    const id = a[0]; if (!id) return { kind: "text", lines: ["usage: open <app>"] };
    const app = byId(id); if (!app) return { kind: "text", lines: [`no app: ${id}`] };
    ctx.os.open(id, { title: app.name, size: app.defaultSize });
    return { kind: "text", lines: [`opened ${id}.`] };
  }},
  { name: "close", desc: "close <app>", run: (a, ctx) => {
    const id = a[0]; const w = ctx.os.windows.find((w) => w.appId === id);
    if (!w) return { kind: "text", lines: [`not open: ${id}`] };
    ctx.os.close(w.id); return { kind: "text", lines: [`closed ${id}.`] };
  }},
  { name: "windows", desc: "list open windows", run: (_, ctx) => ({ kind: "text", lines: ctx.os.windows.length ? ctx.os.windows.map((w) => `  ${w.id}  ${w.appId.padEnd(10)} ${w.minimized?"[min]":""}`) : ["no windows."] }) },
  { name: "resume", desc: "open resume", run: (a, ctx) => {
    if (a.includes("--download")) { window.open("/resume.pdf"); return { kind:"text", lines:["downloading…"] }; }
    if (a.includes("--print")) { ctx.os.open("resume"); setTimeout(() => window.print(), 200); return { kind:"text", lines:["printing…"] }; }
    ctx.os.open("resume"); return { kind:"text", lines:["opened resume."] };
  }},
  { name: "projects", aliases:["p"], desc: "list projects", run: (a, ctx) => {
    const tag = a.find((x) => x.startsWith("--tag="))?.split("=")[1];
    const list = tag ? projects.filter((p) => p.topics.includes(tag) || p.language?.toLowerCase()===tag) : projects;
    if (!list.length) return { kind:"text", lines:["no projects."] };
    const rows = list.map((p) => [p.name, p.language || "—", `★${p.stars}`, (p.description||"").slice(0,50)]);
    void ctx; return { kind:"text", lines: ["", ...table(rows, ["name","lang","★","desc"]), ""] };
  }},
  { name: "project", desc: "open <slug>", run: (a, ctx) => {
    const slug = a[0]; const p = projects.find((x) => x.slug === slug);
    if (!p) return { kind:"text", lines:[`no project: ${slug}`] };
    ctx.os.open("projects", { title: p.name, payload: { slug } });
    return { kind:"text", lines:[`opened ${slug}.`] };
  }},
  { name: "gh", aliases:["g"], desc: "github stuff", run: (a, ctx) => {
    if (!a.length || a[0]==="repos") { ctx.os.open("github"); return { kind:"text", lines:["opening github app…"] }; }
    if (a[0]==="open") { window.open(identity.links.github, "_blank"); return { kind:"text", lines:["→ github.com"] }; }
    return { kind:"text", lines:["usage: gh [repos|open]"] };
  }},
  { name: "skills", desc: "open skills", run: (_, ctx) => { ctx.os.open("skills"); return { kind:"text", lines:["opened skills."] }; } },
  { name: "experience", desc: "open experience", run: (_, ctx) => { ctx.os.open("experience"); return { kind:"text", lines:["opened experience."] }; } },
  { name: "gallery", desc: "open gallery", run: (_, ctx) => { ctx.os.open("gallery"); return { kind:"text", lines:["opened gallery."] }; } },
  { name: "contact", desc: "show contact info", run: (_, ctx) => { ctx.os.open("contact"); return { kind:"text", lines:[`email: ${identity.email}`, `github: ${identity.links.github}`] }; } },
  { name: "email", desc: "compose email", run: () => { window.open(`mailto:${identity.email}`); return { kind:"text", lines:["opened mail client."] }; } },
  { name: "linkedin", desc: "open linkedin", run: () => { window.open(identity.links.linkedin, "_blank"); return { kind:"text", lines:["→ linkedin"] }; } },
  { name: "about", desc: "open about", run: (_, ctx) => { ctx.os.open("about"); return { kind:"text", lines:["opened about."] }; } },
  { name: "settings", desc: "open settings", run: (_, ctx) => { ctx.os.open("settings"); return { kind:"text", lines:["opened settings."] }; } },
  { name: "theme", desc: "theme [set <name>|list]", run: (a, ctx) => {
    if (a[0]==="list" || !a.length) return { kind:"text", lines:["cortex (default)", "retro (P13)", "minimal (P13)", "blueprint (P13)"] };
    if (a[0]==="set" && a[1]) { ctx.settings.setTheme(a[1] as ThemeName); return { kind:"text", lines:[`theme → ${a[1]}`] }; }
    return { kind:"text", lines:[`current: ${ctx.settings.theme}`] };
  }},
  { name: "motion", desc: "motion <on|off>", run: (a, ctx) => {
    if (a[0]==="off") { ctx.settings.setReducedMotion(true); return { kind:"text", lines:["motion reduced."] }; }
    if (a[0]==="on") { ctx.settings.setReducedMotion(false); return { kind:"text", lines:["motion on."] }; }
    return { kind:"text", lines:[`current: ${ctx.settings.reducedMotion?"reduced":"on"}`] };
  }},
  { name: "sysinfo", desc: "system info", run: () => ({ kind:"text", lines:[
    "DivyOS 1.0 — cortex",
    `host: divyos.local`, `arch: web`, `runtime: react 19 / tanstack start`,
    `gpu: ${typeof navigator !== "undefined" ? navigator.userAgent.split(" ").slice(-1)[0] : "?"}`,
    `viewport: ${typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "?"}`,
  ]}) },
  { name: "stack", desc: "tech stack", run: () => ({ kind:"text", lines:[
    "TanStack Start · React 19 · Vite 7 · Tailwind v4",
    "Zustand · Motion · TypeScript strict",
  ]}) },
  { name: "version", desc: "version", run: () => ({ kind:"text", lines:["DivyOS 1.0.0"] }) },
  { name: "roadmap", desc: "phase roadmap", run: () => ({ kind:"text", lines:[
    "P01 ✓ foundations","P02 ✓ shell","P03 ✓ window manager","P04 ✓ snap/resize",
    "P05 ✓ app runtime","P06 ✓ projects","P07 ✓ terminal v1","P08 ✓ launcher",
    "P09–P20: see docs/ROADMAP.md",
  ]}) },
  { name: "reboot", desc: "reboot system", run: () => { useSession.getState().restart(); } },
  { name: "shutdown", desc: "power off", run: () => { useSession.getState().shutdown(); } },
  { name: "lock", desc: "lock session", run: () => { useSession.getState().lock(); return { kind:"text", lines:["session locked."] }; } },
  { name: "logout", desc: "sign out", run: () => { useSession.getState().logout(); } },
  { name: "whois", desc: "current visitor", run: () => ({ kind:"text", lines:[useSession.getState().visitorName ?? "guest"] }) },
  { name: "wallpaper", aliases:["wp"], desc: "wallpaper [list|set <id>]", run: (a) => {
    const wp = useWallpaper.getState();
    if (!a.length || a[0]==="list") return { kind:"text", lines: WALLPAPERS.map((w) => `  ${wp.wallpaperId===w.id?"●":"○"} ${w.id.padEnd(14)} ${w.description}`) };
    if (a[0]==="set" && a[1]) {
      const ok = WALLPAPERS.find((w) => w.id === a[1]);
      if (!ok) return { kind:"text", lines:[`unknown wallpaper: ${a[1]}`] };
      wp.setWallpaper(a[1] as WallpaperId);
      return { kind:"text", lines:[`wallpaper → ${a[1]}`] };
    }
    return { kind:"text", lines:[`current: ${wp.wallpaperId}`] };
  }},
  { name: "notify", desc: "notify <title> [-- body]", run: (a) => {
    if (!a.length) return { kind:"text", lines:["usage: notify <title> [-- body]"] };
    const joined = a.join(" ");
    const [title, body] = joined.split("--").map((s) => s.trim());
    notify({ source: "shell", level: "info", title: title || "notice", body: body || undefined });
    return { kind:"text", lines:["dispatched."] };
  }},
  { name: "notifications", aliases:["notif"], desc: "open notification center", run: () => { useNotifications.getState().toggleCenter(true); return { kind:"text", lines:["opened."] }; } },
  { name: "shortcuts", desc: "open keyboard shortcuts", run: () => {
    const e = new KeyboardEvent("keydown", { key: "?" });
    window.dispatchEvent(e);
    return { kind:"text", lines:["press ? anywhere to toggle."] };
  }},
  { name: "monitor", aliases:["top"], desc: "open system monitor", run: (_, ctx) => { ctx.os.open("monitor"); return { kind:"text", lines:["opened system monitor."] }; } },
  { name: "notes", desc: "open notes", run: (_, ctx) => { ctx.os.open("notes"); return { kind:"text", lines:["opened notes."] }; } },
  { name: "play", desc: "play <snake|2048|flappy|minesweeper|tictactoe>", run: (a, ctx) => {
    const map: Record<string,string> = { snake:"snake", "2048":"t2048", flappy:"flappy", minesweeper:"minesweeper", mines:"minesweeper", ttt:"tictactoe", tictactoe:"tictactoe" };
    const id = map[a[0]]; if (!id) return { kind:"text", lines:["games: snake, 2048, flappy, minesweeper, tictactoe"] };
    const app = byId(id)!; ctx.os.open(id, { title: app.name, size: app.defaultSize });
    return { kind:"text", lines:[`launching ${app.name}…`] };
  }},
  { name: "minimize", desc: "minimize focused window", run: (_, ctx) => {
    const w = [...ctx.os.windows].sort((a,b) => b.z - a.z)[0];
    if (w) ctx.os.minimize(w.id);
    return { kind:"text", lines: w ? [`minimized ${w.appId}.`] : ["no windows."] };
  }},
  { name: "killall", desc: "close all windows", run: (_, ctx) => {
    const ids = ctx.os.windows.map((w) => w.id);
    ids.forEach((id) => ctx.os.close(id));
    return { kind:"text", lines:[`closed ${ids.length} window(s).`] };
  }},
  { name: "factory-reset", desc: "wipe everything", run: () => {
    useOS.persist.clearStorage();
    useSettings.persist.clearStorage();
    useSession.persist.clearStorage();
    useWallpaper.persist.clearStorage();
    useNotifications.persist.clearStorage();
    location.reload();
  }},
  { name: "exit", aliases:["q",":q"], desc: "close terminal", run: (_, ctx) => {
    const w = ctx.os.windows.find((w) => w.appId === "terminal"); if (w) ctx.os.close(w.id);
  }},
  // File System Commands
  { name: "pwd", desc: "print working directory", run: () => ({ kind:"text", lines:[cwd] }) },
  { name: "ls", desc: "list directory contents", run: (a) => {
    const p = resolvePath(a[0] && !a[0].startsWith("-") ? a[0] : ".");
    const isAll = a.includes("-a") || a.includes("-al") || a.includes("-la");
    if (vfsFiles[p]) return { kind:"text", lines:[p] };
    if (!vfs[p]) return { kind:"text", lines:[`ls: cannot access '${a[0]||"."}': No such file or directory`] };
    let items = vfs[p];
    if (!isAll) items = items.filter(i => !i.startsWith("."));
    if (a.includes("-l") || a.includes("-al") || a.includes("-la")) {
      const rows = items.map(i => {
        const full = p === "/" ? `/${i}` : `${p}/${i}`;
        const isDir = !!vfs[full];
        return [isDir ? "drwxr-xr-x" : "-rw-r--r--", "divy", "divy", isDir ? "4096" : (vfsFiles[full]?.length || 0).toString(), i];
      });
      return { kind:"text", lines: table(rows) };
    }
    return { kind:"text", lines: [items.join("  ")] };
  }},
  { name: "cd", desc: "change directory", run: (a) => {
    if (!a.length) { cwd = "/home/divy"; return; }
    const p = resolvePath(a[0]);
    if (vfsFiles[p]) return { kind:"text", lines:[`cd: not a directory: ${a[0]}`] };
    if (!vfs[p]) return { kind:"text", lines:[`cd: no such file or directory: ${a[0]}`] };
    cwd = p;
  }},
  { name: "cat", desc: "concatenate files and print", run: (a) => {
    if (!a.length) return { kind:"text", lines:["usage: cat <file>"] };
    const p = resolvePath(a[0]);
    if (vfs[p]) return { kind:"text", lines:[`cat: ${a[0]}: Is a directory`] };
    if (vfsFiles[p] === undefined) return { kind:"text", lines:[`cat: ${a[0]}: No such file or directory`] };
    return { kind:"text", lines: vfsFiles[p].split("\n") };
  }},
  { name: "mkdir", desc: "make directories", run: (a) => {
    if (!a.length) return { kind:"text", lines:["usage: mkdir <dir>"] };
    const p = resolvePath(a[0]);
    if (vfs[p] || vfsFiles[p]) return { kind:"text", lines:[`mkdir: cannot create directory '${a[0]}': File exists`] };
    vfs[p] = [];
    const parent = resolvePath("..");
    if (vfs[parent] && p !== "/") vfs[parent].push(p.split("/").pop()!);
    return { kind:"text", lines:[] };
  }},
  { name: "touch", desc: "change file timestamps (create file)", run: (a) => {
    if (!a.length) return { kind:"text", lines:["usage: touch <file>"] };
    const p = resolvePath(a[0]);
    if (vfs[p] || vfsFiles[p]) return;
    vfsFiles[p] = "";
    const parent = resolvePath("..");
    if (vfs[parent]) vfs[parent].push(p.split("/").pop()!);
  }},
  { name: "rm", desc: "remove files or directories", run: (a) => {
    if (!a.length) return { kind:"text", lines:["usage: rm <file>"] };
    const p = resolvePath(a[0]);
    if (vfs[p]) return { kind:"text", lines:[`rm: cannot remove '${a[0]}': Is a directory (use rm -rf)`] };
    if (vfsFiles[p] === undefined) return { kind:"text", lines:[`rm: cannot remove '${a[0]}': No such file or directory`] };
    delete vfsFiles[p];
    const parent = resolvePath("..");
    if (vfs[parent]) vfs[parent] = vfs[parent].filter(x => x !== p.split("/").pop()!);
  }},

  // Network & Dev Commands
  { name: "ping", desc: "send ICMP ECHO_REQUEST to network hosts", run: (a) => ({ kind:"text", lines:[`PING ${a[0]||"1.1.1.1"} (${a[0]||"1.1.1.1"}): 56 data bytes`, `64 bytes from ${a[0]||"1.1.1.1"}: icmp_seq=0 ttl=118 time=14.2 ms`, `64 bytes from ${a[0]||"1.1.1.1"}: icmp_seq=1 ttl=118 time=12.1 ms`, `--- ${a[0]||"1.1.1.1"} ping statistics ---`, `2 packets transmitted, 2 packets received, 0.0% packet loss`] }) },
  { name: "curl", desc: "transfer a URL", run: (a) => ({ kind:"text", lines:[`curl: (7) Failed to connect to ${a[0]||"localhost"} port 80: Connection refused`] }) },
  { name: "npm", desc: "node package manager", run: () => ({ kind:"text", lines:["npm ERR! code ENOENT", "npm ERR! syscall open", "npm ERR! path /package.json", "npm ERR! errno -2", "npm ERR! enoent ENOENT: no such file or directory, open '/package.json'"] }) },
  { name: "npx", desc: "execute npm package binaries", run: (a) => ({ kind:"text", lines:[`npx: installed 1 in 0.8s`, `command not found: ${a[0]||"help"}`] }) },
  { name: "yarn", desc: "yarn package manager", run: () => ({ kind:"text", lines:["yarn install v1.22.19", "info No lockfile found.", "[1/4] Resolving packages...", "[2/4] Fetching packages...", "Done in 0.14s."] }) },
  { name: "git", desc: "the stupid content tracker", run: (a) => {
    if (a[0]==="status") return { kind:"text", lines:["On branch main", "Your branch is up to date with 'origin/main'.", "nothing to commit, working tree clean"] };
    if (a[0]==="log") return { kind:"text", lines:["commit 059e2d6 (HEAD -> main)", "Author: Divy <divy@example.com>", "Date:   Today", "", "    refactor: complete Phase 1"] };
    return { kind:"text", lines:["usage: git [--version] [--help] <command> [<args>]", "", "These are common Git commands used in various situations:", "   clone      Clone a repository into a new directory", "   init       Create an empty Git repository", "   add        Add file contents to the index", "   commit     Record changes to the repository", "   push       Update remote refs along with associated objects"] };
  }},
  { name: "docker", desc: "a self-sufficient runtime for containers", run: () => ({ kind:"text", lines:["Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?"] }) },
  { name: "python", desc: "python interpreter", run: () => ({ kind:"text", lines:["Python 3.11.4 (main, Jun 20 2023, 17:23:00) [Clang 14.0.3 (clang-1403.0.22.14.1)] on darwin", "Type \"help\", \"copyright\", \"credits\" or \"license\" for more information.", ">>> exit()"] }) },
  { name: "node", desc: "server-side JavaScript runtime", run: () => ({ kind:"text", lines:["Welcome to Node.js v20.5.0.", "Type \".help\" for more information.", "> .exit"] }) },

  // System Commands
  { name: "top", desc: "display Linux processes", run: () => ({ kind:"text", lines:["top - 15:42:01 up 10 days,  4:21,  1 user,  load average: 0.00, 0.01, 0.05","Tasks: 110 total,   1 running, 109 sleeping,   0 stopped,   0 zombie","%Cpu(s):  1.5 us,  0.5 sy,  0.0 ni, 98.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st","MiB Mem :   7962.4 total,   3102.1 free,   2140.8 used,   2719.5 buff/cache","MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5500.2 avail Mem","","  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND","    1 root      20   0  168340  11804   8416 S   0.0   0.1   0:02.14 systemd","   10 root      20   0       0      0      0 I   0.0   0.0   0:00.00 rcu_tasks_kthre"] }) },
  { name: "ps", desc: "report a snapshot of the current processes", run: () => ({ kind:"text", lines: table([["PID","TTY","TIME","CMD"],["1234","ttys000","0:00.04","zsh"],["1235","ttys000","0:00.01","ps"]]) }) },
  { name: "kill", desc: "send a signal to a process", run: (a) => ({ kind:"text", lines:[`kill: (1234) - No such process`] }) },
  { name: "free", desc: "Display amount of free and used memory in the system", run: () => ({ kind:"text", lines: table([["","total","used","free","shared","buff/cache","available"],["Mem:","8153496","2214304","3143216","124000","2795976","5632192"],["Swap:","2097148","0","2097148"]]) }) },
  { name: "df", desc: "report file system disk space usage", run: () => ({ kind:"text", lines: table([["Filesystem","1K-blocks","Used","Available","Use%","Mounted on"],["/dev/nvme0n1p2","244529304","102403920","129618060","45%","/" ],["tmpfs","4076748","0","4076748","0%","/dev/shm"]]) }) },
  { name: "env", desc: "run a program in a modified environment", run: () => ({ kind:"text", lines:["USER=divy", "SHELL=/bin/zsh", "TERM=xterm-256color", "PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin", "PWD=/home/divy", "HOME=/home/divy"] }) },

  // Easter eggs
  { name: "sudo", desc: "?", run: (a) => ({ kind:"text", lines: a.join(" ").includes("sandwich") ? ["okay."] : ["divy is not in the sudoers file. This incident will be reported."] }) },
  { name: "vim", desc: "?", run: () => ({ kind:"text", lines:["use `:q` to leave."] }) },
  { name: "42", desc: "?", run: () => ({ kind:"text", lines:["the answer."] }) },
  { name: "coffee", desc: "?", run: () => ({ kind:"text", lines:["☕"] }) },
  { name: "matrix", desc: "?", run: () => { useWallpaper.getState().setWallpaper("constellation"); return { kind:"text", lines:["wake up, neo…"] }; } },
  { name: "fortune", desc: "?", run: () => ({ kind:"text", lines:[ ["ship it.","good code is read more than written.","make it work, make it right, make it fast.","the OS is the message.","it compiles, ship it."][Math.floor(Math.random()*5)] ] }) },
  { name: "sl", desc: "steam locomotive", run: () => ({ kind:"text", lines:["      ====        ________                ___________ ","  _D _|  |_______/        \\__I_I_____===__|_________| ","   |(_)---  |   H\\________/ |   |        =|___ ___|   ","   /     |  |   H  |  |     |   |         ||_| |_||   ","  |      |  |   H  |__--------------------| [___] |   ","  | ________|___H__/__|_____/[][]~\\_______|       |   ","  |/ |   |-----------I_____I [][] []  D   |=======|__ ","__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ "," |/-=|___|=    ||    ||    ||    |_____/~\\___/        ","  \\_/      \\_O=====O=====O=====O_/      \\_/           "] }) },
  { name: "cowsay", desc: "configurable speaking cow", run: (a) => {
    const msg = a.length ? a.join(" ") : "moo";
    const border = "-".repeat(msg.length + 2);
    return { kind:"text", lines:[` ${border} `, `< ${msg} >`, ` ${border} `, "        \\   ^__^", "         \\  (oo)\\_______", "            (__)\\       )\\/\\", "                ||----w |", "                ||     ||"] };
  }},
];

const ALIAS_MAP: Record<string,string> = { "ll":"apps","..":"cd ..","cls":"clear","q":"exit",":q":"exit","?":"help","g":"gh","p":"projects","r":"resume","t":"theme","wp":"wallpaper" };

function dispatch(line: string, ctx: Ctx): Out | Promise<Out|void> | void {
  const trimmed = line.trim();
  if (!trimmed) return;
  const expanded = ALIAS_MAP[trimmed.split(/\s+/)[0]] ? ALIAS_MAP[trimmed.split(/\s+/)[0]] + " " + trimmed.split(/\s+/).slice(1).join(" ") : trimmed;
  const [name, ...args] = expanded.split(/\s+/);
  const cmd = COMMANDS.find((c) => c.name === name || c.aliases?.includes(name));
  if (!cmd) return { kind:"text", lines:[`divysh: command not found: ${name}. type \`help\`.`] };
  return cmd.run(args, ctx);
}

type Line = { prompt: boolean; text: string };

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([
    { prompt: false, text: "DivyOS shell (divysh) — type `help` to begin." },
    { prompt: false, text: "" },
  ]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>(() => JSON.parse(localStorage.getItem("divyos:term:hist") || "[]"));
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [lines]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const print = (txt: string | string[]) => {
    const arr = Array.isArray(txt) ? txt : [txt];
    setLines((l) => [...l, ...arr.map((t) => ({ prompt: false, text: t }))]);
  };

  const run = async (raw: string) => {
    setLines((l) => [...l, { prompt: true, text: raw }]);
    if (raw.trim()) {
      const newHist = [...hist, raw].slice(-200);
      setHist(newHist);
      localStorage.setItem("divyos:term:hist", JSON.stringify(newHist));
      setHistIdx(-1);
    }
    const ctx: Ctx = {
      print, os: useOS.getState(), settings: useSettings.getState(),
      clear: () => setLines([]),
    };
    const out = await dispatch(raw, ctx);
    if (out && out.kind === "text") print(out.lines);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { run(input); setInput(""); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(hist.length - 1, histIdx + 1); setHistIdx(i); setInput(hist[hist.length - 1 - i] ?? ""); }
    else if (e.key === "ArrowDown") { e.preventDefault(); const i = Math.max(-1, histIdx - 1); setHistIdx(i); setInput(i === -1 ? "" : hist[hist.length - 1 - i] ?? ""); }
    else if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(/\s+/);
      const last = parts[parts.length - 1];
      if (parts.length === 1) {
        // Autocomplete command
        const matches = COMMANDS.filter((c) => c.name.startsWith(input));
        if (matches.length === 1) setInput(matches[0].name + " ");
        else if (matches.length > 1) {
          print([input, ...matches.map(m => m.name)]);
        }
      } else {
        // Autocomplete file (simple)
        const dir = resolvePath(".");
        const items = vfs[dir] || [];
        const matches = items.filter(i => i.startsWith(last));
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0];
          setInput(parts.join(" ") + (vfs[resolvePath(matches[0])] ? "/" : " "));
        } else if (matches.length > 1) {
          print([input, ...matches]);
        }
      }
    }
    else if (e.key === "l" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setLines([]); }
  };

  return (
    <div className="h-full bg-os-bg flex flex-col font-mono text-[13px] leading-relaxed" onClick={() => inputRef.current?.focus()}>
      <div ref={scrollRef} className="flex-1 overflow-auto px-3 py-2">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {l.prompt && <span className="text-os-signal">{identity.handle}@divyos:~$ </span>}
            <span className={l.prompt ? "text-os-text" : "text-os-text-dim"}>{l.text}</span>
          </div>
        ))}
        <div className="flex">
          <span className="text-os-signal shrink-0">{identity.handle}@divyos:{cwd.replace("/home/divy", "~")}$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="flex-1 bg-transparent outline-none text-os-text caret-os-signal"
          />
        </div>
      </div>
    </div>
  );
}
