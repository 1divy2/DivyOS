# DivyOS Architecture

## High-Level Architecture
DivyOS is built as a Single Page Application (SPA) using React 19 and Vite, wrapped within the TanStack Start framework for optimized routing and potential server-side rendering/API capabilities.

### Core Layers

1. **Routing Layer (TanStack Router)**
   - Manages the top-level entry point. The primary route (`index.tsx`) mounts the OS Boot/Desktop environment.
   - Handles global error boundaries and application wrappers.

2. **OS Shell Layer (`src/os/shell`)**
   - The visual wrapper of the operating system.
   - **Boot:** Startup sequence and loading animations.
   - **Login/Lock:** Authentication screens.
   - **Desktop:** The main workspace area where windows are rendered.
   - **Dock & TopBar:** Persistent navigation and system status indicators.

3. **Window Management Layer (`src/os/store.ts`)**
   - A Zustand store controlling the lifecycle of windows.
   - Tracks spatial coordinates, z-indexing for focus, and window states (minimized/maximized).

4. **Application Layer (`src/os/apps` & `src/os/registry.ts`)**
   - The registry acts as the "installed software" database.
   - Apps are React components loaded dynamically into Window containers by the Window Manager.
   - Categories: Personal, Tools, System, Games.

5. **Content & Data Layer (`src/content`)**
   - Acts as the virtual filesystem.
   - Markdown files (`resume.md`, `about.md`) and JSON files provide content to the applications, keeping logic and data separated.

6. **Services Layer (`src/os/services`)**
   - **Notifications:** System-wide toast/alert management.
   - **Wallpaper:** Desktop background engine.
   - **Session:** User session and persistence logic.
