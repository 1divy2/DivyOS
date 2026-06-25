# Visual Language

## Wallpaper

- Cortex wallpaper = solid `--os-bg` + a 24px `dot-grid` overlay at 4% white.
- Optional ASCII signature bottom-right (`/\\ divyos ...`), 60% opacity.
- Time-of-day shift (P14): hue temperature drifts ±2° across the day.

## Iconography

- App glyphs are single unicode characters (`■ ◫ ▮ ◔ ▣ ⚙ @ ⌥`), 16–20px.
- Inline glyphs (prompt arrows, bullets) use `›`, `·`, `■`.
- No raster icons in chrome. Apps may use SVGs in their **body**.

## Motion (Cortex curves)

| Element | Duration | Curve | Notes |
|---|---|---|---|
| Window open | 120ms | `cubic-bezier(0.2, 0, 0, 1)` | scale 0.98 → 1, opacity 0 → 1 |
| Window close | 90ms | linear | fade |
| Dock hover | 80ms | linear | text color only |
| Boot fade | 200ms | ease | once |
| Cursor blink | 1s | `steps(1)` | infinite |
| Launcher open | 120ms | ease-out | hard cut backdrop + content fade |

When `reducedMotion` is on, all durations clamp to `0ms` except cursor blink.

## Sound (P20)

Optional muted system sounds: window-open click, launcher chord, error blip.
Off by default. Toggle in Settings.

## ASCII flourishes

Use sparingly: boot screen, terminal `figlet` output, signature corner.
Never inside app body content — apps speak typography.
