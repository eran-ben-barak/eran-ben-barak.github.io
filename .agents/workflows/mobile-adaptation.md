---
description: Ensure the mobile experience scales gracefully from the desktop "source of truth".
---
# Desktop-First Mobile Adaptation Workflow

Use this workflow whenever you make a layout change or add a new section. The goal is to ensure the desktop experience is perfect first, and that mobile adapts without "breaking" the desktop logic.

### 1. High-Fidelity Desktop Design
Implement the change for **Desktop (1440px+)** first. Focus on the premium typography, grids, and hover effects that define the site's character.

### 2. Graceful Mobile Adaptation
Add mobile-specific styles using a "graceful degradation" approach. 
- Use `@media (max-width: 768px)` or `@media (max-width: 950px)` (current project standard) to adjust layouts.
- Prefer `clamp()` for fluid font sizes so they scale naturally between desktop and mobile.
- **CRITICAL:** Ensure that mobile adjustments are additive and do not override or conflict with the desktop layout/logic.

### 3. Multi-Device Validation
// turbo
1. Open the changed page in the browser tool.
2. Capture a screenshot at **1920px** (Large Desktop).
3. Capture a screenshot at **1440px** (Standard Desktop).
4. Capture a screenshot at **768px** (Tablet).
5. Capture a screenshot at **375px** (Mobile).
6. Compare: Verify that the "soul" of the desktop design is preserved in the mobile view and no horizontal scrolling or overlap exists.
