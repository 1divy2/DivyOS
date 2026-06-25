// Single source of truth for personal info. Swap values without touching UI.
export const identity = {
  name: "Divy",
  handle: "1divy2",
  role: "Engineer · Builder",
  location: "[placeholder] — set in src/content/identity.ts",
  email: "[placeholder@example.com]",
  links: {
    github: "https://github.com/1divy2",
    linkedin: "[placeholder]",
    twitter: "[placeholder]",
    website: "[placeholder]",
  },
  bio: "Building DivyOS — a personal operating system.",
  bootString: "DivyOS 1.0 — built by Divy. press any key to enter.",
} as const;
