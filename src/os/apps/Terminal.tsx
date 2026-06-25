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
  // Easter eggs
  { name: "sudo", desc: "?", run: (a) => ({ kind:"text", lines: a.join(" ").includes("sandwich") ? ["okay."] : ["nice try."] }) },
  { name: "vim", desc: "?", run: () => ({ kind:"text", lines:["use `:q` to leave."] }) },
  { name: "42", desc: "?", run: () => ({ kind:"text", lines:["the answer."] }) },
  { name: "coffee", desc: "?", run: () => ({ kind:"text", lines:["☕"] }) },
  { name: "matrix", desc: "?", run: () => { useWallpaper.getState().setWallpaper("constellation"); return { kind:"text", lines:["wake up, neo…"] }; } },
  { name: "fortune", desc: "?", run: () => ({ kind:"text", lines:[ ["ship it.","good code is read more than written.","make it work, make it right, make it fast.","the OS is the message."][Math.floor(Math.random()*4)] ] }) },
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
      const m = COMMANDS.find((c) => c.name.startsWith(input));
      if (m) setInput(m.name + " ");
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
          <span className="text-os-signal shrink-0">{identity.handle}@divyos:~$&nbsp;</span>
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
