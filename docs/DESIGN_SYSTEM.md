# Design System — Cortex

The default DivyOS theme is **Cortex**: graphite + signal green,
terminal-native, information-dense without being cyberpunk.

## Color tokens (`src/styles.css`)

| Token | Value | Use |
|---|---|---|
| `--os-bg` | `#0E1014` | desktop background |
| `--os-panel` | `#15181F` | window body |
| `--os-panel-2` | `#1B1F28` | title bar, sidebars |
| `--os-hairline` | `#2A2F3A` | all borders |
| `--os-text` | `#D7DBE2` | primary text |
| `--os-text-dim` | `#8B93A3` | secondary text |
| `--os-text-faint` | `#5A6172` | tertiary / metadata |
| `--os-signal` | `#7CFFB2` | accent, prompt, focus |
| `--os-signal-dim` | `#4ED38A` | hover |
| `--os-warn` | `#FFC56B` | warnings |
| `--os-error` | `#FF6B6B` | errors, destructive |

## Tailwind utility names

Use `bg-os-bg`, `text-os-signal`, `border-os-hairline`, etc. Never write
`text-white`, `bg-black`, or hex literals in components.

## Type

- Mono everywhere by default — `JetBrains Mono`, fallback to `Berkeley Mono`.
- Sans (when needed): `Inter Tight`.
- Sizes: `11px` for chrome/labels (uppercase tracking-wider), `13px` for body,
  `20–24px` for app titles.
- Tabular numerics for clocks and tables.

## Spacing & radius

- Base unit: 4px.
- Radius: `2–8px`. Windows have **no radius** — they're flush rectangles.
- Hairline borders (`1px solid var(--os-hairline)`) carry hierarchy.

## Primitives (deliberately small)

| Name | Used in |
|---|---|
| `WindowFrame` | every window |
| `Dock` (slot rendering) | shell only |
| `TopBar` | shell only |
| `Launcher` | shell only |

**Do not introduce** a generic `Card`, `Sidebar`, or `Dashboard` component
for app bodies. Each app composes its own surfaces.

## Don'ts

- No purple-to-blue gradients.
- No glassmorphism on app bodies (only on dock/top-bar).
- No drop-shadows on text.
- No icon libraries (Lucide/Feather) for system glyphs — use unicode `■ ◫ ▮ ◔ ▣ ⚙`.
