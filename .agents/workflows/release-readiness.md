---
description: Final 3-point check before "shipping" a change to the site.
---
# Release Readiness Workflow

Run this final checklist before completing any major UI or content update. It ensures the site remains professional, accessible, and correctly localized.

### 1. SEO & Metadata Check
- Verify that the page has a unique `title` and `description` in the metadata object.
- Ensure OpenGraph (OG) tags are pointing to the correct assets.
- Check that the `LanguageProvider` is correctly wrapping the page content.

### 2. Accessibility (A11y) Baseline
- **Contrast:** Ensure text is legible against the background in both Light and Dark modes.
- **Labels:** Verify that interactive elements (buttons, sliders, font testers) have descriptive `aria-label`s or hidden `<span>` text for screen readers.
- **Semantics:** Ensure there is one `<h1>` per page and that headings follow a logical order.

### 3. RTL (Hebrew) Symmetry
- Switch the site to **Hebrew** mode.
- Verify that the layout mirrors correctly (RTL).
- Check that text alignment, icons, and navigation buttons respond correctly to the `[dir="rtl"]` attribute.
- **Pixel-Perfect Check:** Ensure that Hebrew alignment is as polished as the English version, with no overlapping elements or broken grids.
