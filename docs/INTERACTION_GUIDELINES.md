# Interaction Guidelines

## Pointer

- Single click on dock icon → open / focus / unminimize.
- Click on a window body → focus that window.
- Drag the title bar → move (only when not maximized).
- Drag a window edge → snap to that edge.
- Drag the bottom-right notch → resize.

## Keyboard (global)

| Key | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open launcher |
| `Esc` | Close top-most modal (launcher) |
| `Enter` (boot) | Skip boot animation |

## Keyboard (terminal)

See `COMMAND_SPECIFICATION.md`.

## Touch

- Tap dock icon → open / focus.
- Long-press window title (P15) → window menu.
- Swipe-up from bottom (P15) → app switcher card stack.
- Pinch (P15) → not used; reserved for Gallery zoom.

## Focus order

1. Top bar buttons (left → right)
2. Dock (left → right)
3. Focused window — its own DOM order

## Reduced motion

`prefers-reduced-motion: reduce` and the Settings toggle both clamp all
transition durations to 0ms and disable the boot scanline.

## A11y targets (P17)

- All controls keyboard-reachable.
- Window has `role="dialog"` + `aria-label` (P17).
- Contrast: every `--os-text*` against `--os-bg/--os-panel` ≥ WCAG AA.
- Focus ring: `--os-signal` 1px on focused window + interactive controls.
