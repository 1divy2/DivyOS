# Product Vision

## What DivyOS is

A fictional personal operating system that serves as Divy's portfolio. The
browser disappears. The visitor boots into a desktop environment designed
around one person.

## What DivyOS is **not**

- Not a portfolio website
- Not a dashboard
- Not a landing page
- Not a resume website
- Not a Windows / macOS / Linux clone
- Not a desktop wallpaper with icons

## The visitor target

When someone leaves the site, the win condition is they say:

> "I forgot I was on a website."

If they say "nice portfolio" or "nice desktop clone", we failed.

## Non-goals

- Multi-user accounts. There is one user: Divy.
- Real file management. The FS is a metaphor, scoped to content.
- Cross-tab persistence. State is per-session via localStorage.
- A real terminal emulator. The terminal is a command bus with structured output, not bash.

## Constraints we ship under

- **No AI slop.** No purple-on-white gradients, no Inter+Poppins everywhere, no generic cards.
- **No component reuse for major experiences.** Each app has its own chrome.
- **Mobile-first responsive.** Same OS, adapted — never a separate site.
- **Production-ready.** Deployable, fast, accessible.
