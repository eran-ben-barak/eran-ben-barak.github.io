---
description: Scan the codebase for design token consistency (CSS variables).
---
# Design Consistency Audit Workflow

Use this workflow to ensure new code adheres to the project's "perfect" design system and avoids "CSS drift".

### 1. Token Verification
When adding styles, verify they use the existing variables defined in `globals.css`:
- **Colors:** `--bg-color`, `--text-color`, `--accent-color`, `--border-color`, `--grid-color`.
- **Fonts:** `--font-sans` (Monoklass), `--font-mono` (Geist Mono), `Neoklass` (for headers).

### 2. Deep Scan for Hardcoded Values
Before finishing a task, run a search through the modified files:
- Search for hex codes (e.g., `#000000`, `#FFFFFF`).
- Search for "magic numbers" in spacing or font sizes.

### 3. Refactor to Tokens
If hardcoded values are found:
- Map them to the closest existing CSS variable.
- If a new variable is truly needed (e.g., for a specific project's primary color), suggest adding it to the `:root` rather than inlining it.
- Ensure all buttons/cards maintain the "Invert-on-Hover" pattern found in `font-card` and `btn-primary`.
