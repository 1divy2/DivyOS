# App Specifications

Every app has its own chrome, empty state, and primary actions. **No
shared "card" component for major experiences.**

| App | Min Size | Default Size | Source | First-run |
|---|---|---|---|---|
| About | 360 × 320 | 560 × 460 | `content/about.md` + `identity.ts` | auto-open |
| Terminal | 480 × 280 | 760 × 480 | runtime | on demand |
| Projects | 560 × 360 | 880 × 560 | `projects.generated.json` | on demand |
| Resume | 480 × 400 | 680 × 600 | `content/resume.md` | on demand |
| Skills | 400 × 320 | 640 × 480 | `content/skills.ts` | on demand |
| Experience | 480 × 360 | 640 × 520 | `content/experience.ts` | on demand |
| Gallery | 480 × 360 | 720 × 520 | `/public/gallery/*` | on demand |
| Contact | 360 × 280 | 520 × 420 | `identity.ts` | on demand |
| GitHub | 520 × 360 | 760 × 520 | `projects.ts` (live in P18) | on demand |
| Settings | 400 × 320 | 560 × 440 | `useSettings` | on demand |

## Conventions per app

- **Header.** Each app's window has the same status-line title bar (`■ <appid> — <title>`); the **body** is custom per app.
- **Empty states.** Always written in `divysh` voice — `// drop images in /public/gallery/`, never "Nothing here yet!".
- **Keyboard.** Apps respond to native focus + tab. App-specific keymaps documented in this file as they're added.
- **Mobile.** Each app uses `flex-col` / responsive grids and tested at 360×640.

## Terminal-specific

See `COMMAND_SPECIFICATION.md`. The terminal listens to `Tab` (autocomplete),
`↑/↓` (history), `Ctrl+L` (clear). It focuses the input on any click in the
window body.

## Projects-specific

Loads from `projects.generated.json` (built from `github.com/1divy2`).
The sidebar is a real navigator — selection is keyboard-friendly. Each
project view shows: title, description, language, stars, dates, topics,
github link, optional live link. Per-project rich content (architecture,
gallery, timeline) is P06+.
