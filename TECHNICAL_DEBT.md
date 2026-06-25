# DivyOS Technical Debt

This document outlines the technical debt inherited from the Lovable generation phase that must be addressed.

## 1. Unused Boilerplate & Lovable DNA
- `lovable-error-reporting.ts` and related telemetry/error catching that isn't native to the OS experience.
- `src/components/ui/` contains Radix/Tailwind components that are either completely unused or styled too generically.

## 2. Generic Layouts
- Applications currently share repetitive, generic "card" and "container" layouts.
- *Fix:* Every application must have a unique layout tailored to its function.

## 3. Mock Data Coupling
- Currently, apps import their data directly from `src/content/` files as constants.
- *Fix:* Implement a Virtual File System (VFS) abstraction so apps request data asynchronously, mimicking a real OS.

## 4. Window Manager Limitations
- Snapping logic is rudimentary.
- Maximizing/Minimizing doesn't always account for the exact dimensions of the Dock and TopBar.
- No multi-monitor or workspace abstractions.

## 5. Performance
- Large bundle size if all apps and their heavy dependencies (e.g., charts, complex viewers) are loaded at boot.
- *Fix:* Implement React lazy loading (`React.lazy`) for applications in the registry so they only load when launched.
