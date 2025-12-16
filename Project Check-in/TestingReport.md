## Testing Report

I tested functions, callbacks, and interactions between back-end logic and visual feedback.

---

### Bugs Fixed

- Ball path resetting when new connections added
- Notes triggered on click instead of ball hit
  - Updated p.mousePressed to prevent note on click
- ADSR sliders triggered notes
  - Isolated sliders from grid
  - isInsideGrid wraps mouse events inside grid

---
