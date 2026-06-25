# DivyOS State Management

DivyOS relies heavily on global state to simulate a persistent operating system environment.

## Primary Store: Zustand
We use Zustand (`src/os/store.ts`) for its minimal boilerplate and excellent performance.

### OS Store (`useOS`)
Manages:
- The array of currently open windows.
- The global `zCounter` for window depth sorting.
- Boot sequence status.
- App Launcher visibility.

**Persistence:**
The store uses Zustand's `persist` middleware to save the state to `localStorage` under the key `divyos:windows`. This ensures that refreshing the browser restores the exact window layout.

### App-Specific State
Applications should manage their own internal state using React `useState` or local Zustand stores if complex.
However, if an app's state needs to persist across being closed and reopened, it should be serialized into the VFS or stored in a dedicated persistent Zustand slice.

## Theming & Settings
(To be implemented fully)
A separate store or slice should handle:
- Theme preferences (Dark, Light, Custom).
- Wallpaper selection.
- System metrics (volume, network status parody).
