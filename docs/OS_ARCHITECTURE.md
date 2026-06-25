# OS Architecture

The kernel-shell layering DivyOS uses internally.

```text
┌─────────────────────────────────────────────────────────┐
│  Shell  (Desktop · Dock · TopBar · Launcher · Notif)    │
├─────────────────────────────────────────────────────────┤
│  Window Manager  (focus · z-order · snap · persist)     │
├─────────────────────────────────────────────────────────┤
│  App Runtime  (registry · lifecycle · intents · deep-   │
│                link · per-app state)                    │
├─────────────────────────────────────────────────────────┤
│  Kernel Services                                        │
│   ├─ CommandBus    (terminal + palette + shortcuts)     │
│   ├─ SearchIndex   (apps · projects · skills · cmds)    │
│   ├─ FS (virtual)  (content/* loaded as a tree)         │
│   ├─ ThemeEngine   (tokens · per-app overrides)         │
│   ├─ Notifications (toast · history)                    │
│   ├─ SettingsStore (persisted via localStorage)         │
│   └─ EventBus      (pub/sub between apps)               │
├─────────────────────────────────────────────────────────┤
│  Content Layer  (data/*.json · content/*.md · GitHub)   │
└─────────────────────────────────────────────────────────┘
```

## Stores

| Store | Persisted key | Owns |
|---|---|---|
| `useOS` | `divyos:windows` | windows array, z-counter, bootDone, launcherOpen |
| `useSettings` | `divyos:settings` | theme, reducedMotion, density |
| Terminal history | `divyos:term:hist` | last 200 commands |

## Window lifecycle

1. App calls `useOS.open(appId, opts)` → creates `WindowState`.
2. `WindowLayer` renders each `WindowFrame` keyed by id, ordered by z.
3. User interactions (drag/resize/focus) mutate the store.
4. `persist` middleware writes to localStorage; reload restores.

## Deep links (P19)

`/?app=projects&id=<slug>` hydrates the right window stack on load. Until
P19, only persisted windows restore.

## Event bus (P12)

A tiny pub/sub for cross-app notifications. Apps emit `notify(level, text)`;
the Notification Center subscribes.
