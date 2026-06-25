# DivyOS Window System

The DivyOS Window System is responsible for rendering, managing, and compositing virtual application windows within the browser viewport.

## State Management (`store.ts`)
The `useOS` store maintains an array of `WindowState` objects:
```typescript
export type WindowState = {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; w: number; h: number }; // For restoring from maximized state
  payload?: Record<string, unknown>;
};
```

## Window Component (`src/os/Window.tsx`)
A highly interactive Framer Motion component that wraps every instantiated application.

### Features
1. **Draggable:** Utilizes Framer Motion's `drag` capabilities, bounded by the viewport constraints (excluding TopBar and Dock).
2. **Resizable:** Custom resize handles allow modifying `w` and `h` properties in the store.
3. **Focus Management:** Clicking a window triggers `focus(id)`, bumping its `z` value to `zCounter + 1`.
4. **Snapping:** Edge-detection logic to snap windows to left/right halves or fullscreen.
5. **Animations:** Smooth enter/exit and maximize/minimize transitions.

## Future Enhancements
- Hardware-accelerated blur (Glassmorphism) without lag.
- Improved multi-window snapping grids.
- Workspace memory (remembering layouts across sessions).
