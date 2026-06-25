# Window System

## Capabilities

| Capability | Status |
|---|---|
| Open / close | ✓ P03 |
| Focus / z-order | ✓ P03 |
| Drag | ✓ P03 |
| Persistence (size/pos/z) | ✓ P03 |
| Resize (corner handle) | ✓ P04 |
| Snap: edge-drag → ½ / full | ✓ P04 |
| Maximize / restore | ✓ P04 |
| Minimize → dock | ✓ P04 |
| Multi-instance per app | ✓ P04 (via singleton flag) |
| Keyboard shortcuts | partial (Esc closes launcher) |

## Layout invariants

- Top bar: `32px`, fixed top, `z:50`.
- Dock: `56px`, fixed bottom, `z:50`.
- Windows: `z >= 11`, clamp inside `[TOP_BAR, vh - DOCK]`.
- Min window: `320 × 220`.

## Mobile / tablet adaptation

- **`vw ≥ 1024`** — full desktop windowing.
- **`640 ≤ vw < 1024`** — same windowing, larger resize hit-zones.
- **`vw < 640`** — windows force-fullscreen, draggable header disabled,
  dock collapses to a single launcher trigger + swipe-stack (P15).

## Snap math

Edge-drag: when pointer is within 4px of an edge on drag-end:

- left → `{ x:0, y:TOP_BAR, w:vw/2, h:vh-TOP_BAR-DOCK }`
- right → `{ x:vw/2, y:TOP_BAR, w:vw/2, h:vh-TOP_BAR-DOCK }`
- top → maximize

## Accessibility

- Focused window gets a 1px `--os-signal` ring (P14).
- ESC closes the top-most modal (launcher).
- All window controls are real `<button>`s with `title`.
- Tab order: top bar → dock → focused window content.
- `prefers-reduced-motion` respected via `useSettings.reducedMotion`.
