# Zensical bug reproductions

Two separate minimal projects for Zensical 0.0.74 / Zensical UI 0.0.41. Each ZIP contains only `zensical.toml`, `docs/index.md`, the recorded `requirements.txt`, and an English README with precise reproduction steps. Generated sites and caches are excluded.

- `scrollbar-overlay.zip`: inline line-number scrollbars paint over the floating table of contents in Chromium mobile rendering.
- `line-selection-scroll.zip`: selecting a visible code line scrolls it behind the fixed header, using the default Markdown configuration.

Both projects passed clean strict builds and browser verification with an extension-free temporary profile. The screenshots are from these English reproductions. No main-site content or private data is included.
