# Search / Launcher

Trigger: `⌘K` / `Ctrl+K` from anywhere, or the `⌘K` chip on the top bar.

## Indexes

| Source | Status |
|---|---|
| Apps | ✓ |
| Projects | ✓ |
| Commands | P08+ (planned) |
| Skills | P09 |
| Resume sections | P10 |
| Certificates | P09 |
| GitHub repos (live, cached) | P18 |
| Settings | P13 |

## Ranking

Substring match on `label + sub`. P08+: fuzzy (mini-fuse) with
recency boost from terminal/launcher history.

## Modes (P11+)

| Prefix | Scope |
|---|---|
| (none) | everything |
| `>` | commands only |
| `#` | projects only |
| `@` | contact actions |
| `/` | files / FS |

## Result actions

| Key | Action |
|---|---|
| `Enter` | open / focus |
| `⌘+Enter` | open in new window (P08+) |
| `⌥+Enter` | copy deep link (P19) |
| `Esc` | close launcher |
