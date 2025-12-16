## Development Progress Report 1

To develop the core functionalities of my software, I experimented with different back-end logic with a simple front-end user interface:

---

- Grid System
  - 20x20 grid made up of cells that are activated when connected to one another.
  - (activeCells), (connections)
- Clicking cell activates it, and dragging between two active cells connects them.
- Balls traverse lines connecting active cells.
- Notes of cells are triggered when a ball reaches a cell
- Right-clicking an active cell de-activates it and removes connections.
- Tonal.js handles MIDI mapping of grid.
- ADSR envelope processes Tone.js synth.

---

### Challenges

- Logic of multiple balls on separate lines
- Constraining clicking event to the grid to prevent notes activating without ball hitting them
