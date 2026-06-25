# DivyOS System Architecture

This document expands on the general architecture to detail the internal system design.

## Core System Modules

### 1. The Kernel (Zustand Store)
The OS "kernel" is essentially the `useOS` Zustand store. It manages:
- Window lifecycle (open, close, focus, move, resize).
- Z-index counter for depth sorting.
- System states (boot done, launcher open).
- Persistence (saving window state to localStorage).

### 2. The Registry (`registry.ts`)
The central directory of all executable programs.
- Defines `AppDef` interface (id, name, glyph, component, defaultSize).
- Provides the mapping necessary for the Launcher and Dock to render available apps and for the Window Manager to instantiate them.

### 3. Virtual File System (VFS)
Currently implemented as static imports from `src/content/`.
- Future iterations will abstract this into an asynchronous VFS API to allow the Terminal and Files app to read/write/navigate a simulated directory structure.

### 4. Background Services
- **Wallpaper Engine:** Manages transitions, themes, and animated backgrounds.
- **Notification Daemon:** Listens for system events and displays unobtrusive UI notifications.

### 5. Hardware Abstraction
- Relies on browser APIs (Window dimensions, LocalStorage, potentially IndexedDB for larger file storage, Service Workers for caching).
