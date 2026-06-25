
# DivyOS — Premium Redesign

Goal: stop looking like a "developer-portfolio-pretending-to-be-an-OS". Build something that feels like a small product team obsessed over every pixel. Visitors should say *"I'd actually use this."*

This is a full-shell rewrite, executed as one cohesive pass (not isolated phases) so the language stays consistent everywhere.

---

## 1 — Kill the AI-generated tells

Removed entirely:
- Fake telemetry: `CPU 03%`, `MEM 412M`, `NET`, uptime, kernel stats, process count, battery.
- Dotted grid wallpaper, raw black backgrounds, "developer grid".
- ASCII-rain matrix wallpaper, terminal-style chrome on the topbar.
- The current dock with text labels ("ABOU / TERM / CONT / SETT").
- The corner ASCII art (`/\ divyos / cortex`).
- "About" window's terminal-banner aesthetic as the *only* design language.

Replaced with:
- A **menu bar** showing only meaningful info: app menu (Divy), focused app name, time, date, weather glyph (real `navigator.language`-aware), control-center toggle.
- A real **wallpaper engine** (see §3).
- Custom **icon system** (see §5).

---

## 2 — New visual language: "Sable"

One opinionated design system, not three. Drops the "Cortex terminal" look as the global skin — terminal *keeps* its monospace identity, but the shell is now warmer and more cinematic.

Tokens (in `src/styles.css`):
- Palette: deep slate `#0B0D12` → `#11141B`, surface `#171A22` w/ 8–14 % white overlay, hairline `rgba(255,255,255,.06)`, ink `#E8E6E1`, ink-muted `#8B8A86`, accent **iris** `#A8B4FF`, accent **amber** `#E8B57A`, signal `#7BE3B0` (used sparingly, terminal only).
- Type: **Söhne / Inter Tight** for UI, **JetBrains Mono** for terminal & code, **Fraunces** for headings inside Resume/Notes (gives those apps a documentary feel).
- Radius scale 6 / 12 / 18 / 28, shadow scale soft/medium/dramatic using layered shadows with a 1 % inner-stroke for the glass edge.
- Motion: spring (stiffness 320, damping 28) for windows; cubic `0.2,0.8,0.2,1` for menus. All under a reduced-motion guard.

---

## 3 — Wallpaper engine (real, not a grid)

Six wallpapers, all generated at runtime, all gorgeous, all <8 KB of code:

1. **Aurora** — three smooth Perlin gradients drifting; default.
2. **Dune** — procedural SDF dunes at sunset (canvas, single shader-like pass).
3. **Meridian** — minimal 3D gradient mesh with a slow parallax.
4. **Constellation** — animated stars with subtle drift + occasional shooting star.
5. **Glass** — frosted light leaks behind iridescent shapes.
6. **Paper** — light cream wallpaper for the optional Day theme.

Wallpaper Manager lives in Settings with live previews, schedule (Auto: Aurora day / Constellation night), and a "Dynamic" toggle that picks one based on local hour.

---

## 4 — Shell rebuild

- **MenuBar** (top): glass bar, 36 px, `Divy ▸ About / Settings / Lock / Restart / Shut Down`, focused-app menus, right side: control-center pill, date + time.
- **Control Center** (slide-down panel): wallpaper quick switch, theme toggle, do-not-disturb, sound, brightness (cosmetic), now-playing card.
- **Dock** (bottom): macOS-style magnification with real physics (distance-based scale), running dot, drag-reorder, right-click context menu, separator before Trash. Pinned apps persist.
- **Desktop icons**: 4-column grid on the right edge, drag-positionable, double-click to open, right-click for context menu, multi-select rectangle.
- **Window chrome**: 14 px radius, layered shadow, 1 px inner-glow, traffic-light controls (close/min/zoom) with subtle hover fills. Each app may override the chrome accent.
- **Spotlight (⌘K)**: redesigned — large search field, sectioned results (Apps / Projects / Commands / Files / Web fallback), inline previews, recent searches.

---

## 5 — Custom icon system

Hand-drawn SVG icon set (single file `src/os/icons/AppIcon.tsx`), 64 px squircle with per-app gradient + glyph. No emoji, no Lucide-as-app-icon. Style: soft inner-light + outer drop, glyph in ink.

---

## 6 — Apps (each with its own personality)

| App | Identity |
|---|---|
| **About** | Editorial single-page profile, Fraunces headings, portrait, marquee of fields. |
| **Projects** | Three-pane file browser: sidebar (tags) / list / detail with hero, README excerpt, stars graph. |
| **Terminal** | Monospace, green signal, scanline-free, ligatures, MOTD, prompts with git-style branch. |
| **Resume** | Paper sheet w/ shadow, print stylesheet, download PDF. |
| **Skills** | Radial cluster + filterable chips. |
| **Experience** | Horizontal scrubable timeline. |
| **Education** | Vertical card stack. |
| **Certificates** | Polaroid wall. |
| **Gallery** | Edge-to-edge masonry, lightbox. |
| **Contact** | Index-card with copyable fields + send-message form. |
| **GitHub** | Activity dashboard (contribution heatmap, language donut). |
| **Notes** | Markdown editor + preview, multi-doc sidebar (keep). |
| **Files** | Virtual FS browser (`~/projects`, `~/desktop`, `/etc/divyos`). |
| **Browser** | Minimal in-OS browser w/ pinned tabs to my links. |
| **Downloads** | Receipts of resume/cert downloads. |
| **Music** | Lo-fi player with 3 curated tracks (royalty-free), waveform, mini-player on dock. |
| **Calculator** | Tactile, large display, scientific toggle. |
| **Calendar** | Month view, shows education/work timeline as events. |
| **Markdown Viewer** | Opens `.md` files double-clicked from Files. |
| **Theme Studio** | Pick accent, radius, density; export `theme.json`. |
| **Wallpaper Manager** | Lives inside Settings. |
| **System Monitor** | *Real* metrics only: viewport, devicePixelRatio, FPS, JS heap, connection type. Honest. |
| **Trash** | Drop items, restore, empty. |
| **Games** | See §7. |

(Existing Inspector is rebuilt into "System Monitor"; existing About is rewritten.)

---

## 7 — Native games

Each is a real React component, no iframe:
- **Snake** — grid, keyboard + swipe, hi-score local.
- **Flappy** — canvas, gravity, score, pipes.
- **Minesweeper** — beginner/intermediate/expert.
- **2048** — keyboard + swipe, undo.
- **Tic-Tac-Toe** — vs. minimax bot.

Shared `<GameWindow/>` chrome: dark cabinet, neon bezel, hi-score badge, fullscreen toggle.

---

## 8 — Lifecycle (kept, redesigned)

- **Boot** — Divy mark fades in, hairline progress, no fake `[ok]` log spam.
- **Login** — soft wallpaper blur, single name field.
- **Lock** — clock + blurred wallpaper.
- **Sleep** — dim to black, breath-pulse dot.
- **Shutdown / Restart** — clean fade (no CRT collapse cliché).
- **Notifications** — top-right stack, grouped by app, swipe to dismiss.
- **Clipboard manager** — `⌘⇧V` shows last 10 copied items.
- **Context menus** — desktop, window, file, dock — all radix.
- **Workspaces** — 3 spaces, `^1 ^2 ^3`, indicator in menu bar.
- **Snapping** — half/quarter/full + magnet preview.

---

## 9 — Terminal evolution

Stays the signature feature. Adds:
- Themes (`theme set dune | aurora | classic`).
- Aliases stored in vFS (`~/.divyshrc`).
- `open <app>`, `play <game>`, `wallpaper <name>`, `fetch` (neofetch w/ real data), `weather`, `gh <user>`, `whois divy`, `cv`, `contact`, `sudo make-coffee`.
- Tab completion on apps, files, commands.
- Pipes `|`, redirection `>`, command substitution.
- Easter eggs: `matrix`, `starfield`, `vim` (joke), `sudo rm -rf /` (refuses w/ wink).

---

## 10 — Removed / replaced files

Removed: `Wallpaper`'s dot-grid + ascii-rain renderers, topbar telemetry block, ASCII corner mark, dock text labels.
Rebuilt: `TopBar → MenuBar`, `Dock`, `Wallpaper`, `Desktop`, `Window`, all app icons, `About`, `Inspector → SystemMonitor`, `Settings`.
New: `ControlCenter`, `Spotlight`, `DesktopIcons`, `Clipboard`, `Workspaces`, `Files`, `Browser`, `Music`, `Calculator`, `Calendar`, `Trash`, `ThemeStudio`, `Downloads`, `Certificates`, `Education`, 5 game apps, `AppIcon` system, wallpaper renderers (Aurora, Dune, Meridian, Constellation, Glass, Paper).

---

## Technical notes

- All state continues through the existing Zustand stores; adds `clipboard`, `workspaces`, `desktopIcons`, `trash`, `pinnedApps`.
- Wallpapers are `<canvas>` w/ `requestAnimationFrame` paused when tab hidden or reduced-motion.
- Fonts loaded via `<link>` in `__root.tsx` (Inter Tight, JetBrains Mono, Fraunces) — not `@import` in CSS.
- No new packages required beyond what's installed (framer-motion, radix, zustand).
- Build verified after each track; Playwright smoke test at end covers: boot → desktop → spotlight → open Projects → switch wallpaper → play Snake → terminal `fetch` → lock → shutdown.

---

## Execution order (single pass, no waiting)

1. Tokens + fonts + new wallpapers + MenuBar/Dock/Desktop rewrite.
2. Icon system + all app icons.
3. Rebuilt apps in tiers: About / Projects / Terminal / Resume first (visible immediately).
4. New utilities (Files, Calculator, Calendar, Music, Browser, Trash, Downloads, Clipboard).
5. Games (5).
6. Theme Studio + System Monitor + Wallpaper Manager.
7. Lifecycle polish, workspaces, snapping refinement.
8. Smoke test + screenshots.

Estimated scope: ~45–55 files touched/created. Big — but the goal needs it.

Approve and I start with track 1.
