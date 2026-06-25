# DivyOS Visual Language

## Philosophy
"I genuinely forgot I was inside a browser."
The visual language must evoke the feeling of a premium, handcrafted operating system. It must explicitly reject the generic look of web-based desktop simulators, Tailwind boilerplate, and 1:1 copies of Windows or macOS.

## Core Elements

### Colors
- Avoid flat, generic RGB values.
- Rely on rich, deep HSL tailored palettes.
- Primary Interface: Dark, immersive tones with high-contrast text.
- Accent colors must be vibrant but not overwhelming.

### Typography
- **UI Text:** Use modern sans-serif like Inter or Geist.
- **Terminal:** High-quality monospace, potentially with ligatures (e.g., Fira Code, JetBrains Mono).
- Use strict typographic scales to enforce hierarchy.

### Depth & Elevation
- Z-indexing is not just functional but visual.
- Active windows should cast subtle, realistic drop shadows.
- Background windows should dim slightly or reduce their shadow intensity to establish a clear focal point.

### Motion & Micro-interactions
- Framer Motion drives the UI physics.
- Windows must have mass and springiness when opened, closed, maximized, or snapped.
- Hover states on icons and buttons should feel tactile.

### Avoidances
- DO NOT use generic dotted backgrounds.
- DO NOT use standard Radix UI aesthetics without heavy customization.
- DO NOT create generic SaaS dashboards inside apps.
