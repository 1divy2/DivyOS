# Architecture

## Stack

- **TanStack Start v1** — single `/` route renders the shell.
- **React 19** — concurrent, Suspense-ready.
- **Vite 7** — dev server + bundler.
- **Tailwind v4** — design tokens in `src/styles.css`.
- **Zustand** — per-service stores (windows, settings, terminal history).
- **Motion (Framer Motion)** — window choreography (P14).
- **TypeScript strict** — content schemas via `zod` (P06).

## Deploy

Cloudflare Workers via the TanStack Start adapter. The app is fully SSR-able.
No Node-only packages (per server-runtime constraints).

## Module boundaries

```text
src/
  content/         # personal data — JSON/TS/MD (no UI imports)
  os/
    store.ts       # window manager state (Zustand + persist)
    settings.ts    # theme / motion / density (Zustand + persist)
    registry.ts    # app registry — maps appId → component
    Window.tsx     # WindowFrame + WindowLayer
    shell/         # Desktop, TopBar, Dock, Launcher, Boot
    apps/          # one file per app, no shared "card" component
  routes/          # TanStack file-based routing
    index.tsx      # mounts <Desktop />
    __root.tsx     # html shell + providers
  components/ui/   # shadcn primitives (used only inside apps that opt in)
```

## Data flow

```text
content/*.{ts,md,json}
        │
        ▼
   typed loaders         ◄── apps import from @/content/*
        │
        ▼
   App components
        │ (open / close / focus)
        ▼
   useOS store ──► WindowFrame ──► rendered windows
```

## Build pipeline

1. `bun run dev` — Vite dev server on :8080.
2. `bun run build` — production SSR bundle for Cloudflare.
3. Projects seeding: `scripts/seed-github.ts` (P06) fetches
   `https://api.github.com/users/1divy2/repos` and writes
   `src/content/projects.generated.json`.
