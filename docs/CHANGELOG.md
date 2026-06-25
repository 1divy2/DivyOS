# Changelog

## 0.1.0 — 2026-06-25

First public boot. Phases **P01–P08** shipped.

### Added

- **Foundations (P01)** — TanStack Start v1 scaffold; Cortex design tokens in `src/styles.css`; content loaders for identity, about, resume, skills, experience, projects.
- **Shell (P02)** — Desktop surface with dot-grid wallpaper; top bar with live clock + system pseudo-stats; floating dock; boot animation with skippable boot sequence.
- **Window manager (P03–P04)** — Open/close/focus/drag/resize/minimize/maximize/edge-snap; per-window position + z persistence in localStorage.
- **App runtime (P05)** — App registry; singleton + multi-instance windows; deep payload routing.
- **Apps** — About, Resume (with print + download + zoom + search), Projects (seeded from `github.com/1divy2`, 13 real repos), Skills, Experience, Gallery placeholder, Contact, GitHub, Settings.
- **Terminal v1 (P07)** — `divysh` shell with 50+ commands, history (200), autocomplete on `Tab`, persistent storage, aliases (`ll`, `cls`, `q`, `?`, `g`, `p`, `r`, `t`), easter eggs.
- **Launcher (P08)** — `⌘K` / `Ctrl+K` system-wide search over apps + projects.
- **Phase 0 docs (15 files)** — Vision, identity, architecture, OS architecture, window system, command spec, search system, app specs, design system, visual language, interaction guidelines, feature matrix, roadmap, this changelog.

### Known

- Themes other than Cortex are stubs (P13).
- Mobile uses fullscreen windows; card-stack switcher lands P15.
- No accessibility audit yet (P17).
- GitHub data is build-time only; live refresh is P18.

## 0.0.0 — planning

Project conceived.
