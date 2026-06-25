# Command Specification

Source of truth: `src/os/apps/Terminal.tsx`. This document is the
human-facing index. The shell is called **divysh**.

## Parsing

```
<command> [args...] [--flag[=value]]
```

Aliases are expanded as the first token (e.g. `ll` → `apps`). Output is
structured — text lines today; tables and components in P11.

## Commands (current)

### System

| Command | Aliases | Description |
|---|---|---|
| `help` | `?` | List available commands |
| `clear` | `cls` | Clear screen |
| `echo <text>` | | Echo text |
| `whoami` | | Print user handle |
| `uname` | | System name |
| `uptime` | | Session uptime |
| `date` | | Current date |
| `history` | | Command history |
| `sysinfo` | | Host / kernel / viewport |
| `stack` | | Tech stack |
| `version` | | DivyOS version |
| `roadmap` | | Current phase status |
| `reboot` | | Clear storage + reload |
| `exit` | `q`, `:q` | Close terminal |

### Apps

| Command | Description |
|---|---|
| `apps` | List installed apps |
| `open <app>` | Open an app |
| `close <app>` | Close an app's window |
| `windows` | List open windows |

### Content

| Command | Aliases | Description |
|---|---|---|
| `about` | | Open About |
| `resume` | | Open Resume |
| `resume --download` | | Download `/resume.pdf` |
| `resume --print` | | Open + print |
| `projects` | `p` | List projects |
| `projects --tag=<t>` | | Filter by language/topic |
| `project <slug>` | | Open one project |
| `skills` | | Open Skills |
| `experience` | | Open Experience |
| `gallery` | | Open Gallery |
| `contact` | | Show contact info |
| `email` | | Compose mail |
| `linkedin` | | Open profile |

### GitHub

| Command | Aliases | Description |
|---|---|---|
| `gh` / `gh repos` | `g` | Open GitHub app |
| `gh open` | | Open profile in new tab |

### Theme / UI

| Command | Description |
|---|---|
| `theme` | Show current theme |
| `theme list` | List themes |
| `theme set <name>` | Set theme |
| `motion <on\|off>` | Reduced motion toggle |

### Easter eggs

`sudo make me a sandwich` · `vim` · `42` · `coffee` · `matrix` · `fortune`

## Aliases

```
ll → apps      cls → clear     q → exit
.. → cd ..     ? → help        g → gh
p → projects   r → resume      t → theme
```

## Keyboard

| Key | Action |
|---|---|
| `Enter` | Run command |
| `↑` / `↓` | History prev / next |
| `Tab` | Autocomplete command name |
| `Ctrl+L` / `⌘+L` | Clear screen |

## Roadmap to 120+

Phases P11 / P18 add: pipes (`|`), output redirection (`> file`), reverse
search (`Ctrl+R`), live `gh stars`, `gh recent`, `man <cmd>`, `cowsay`,
`figlet`, `htop` (fake), `snake`, file-system commands (`ls`, `cd`, `cat`,
`tree`), and per-user aliases.
