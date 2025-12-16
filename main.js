const sustainedNotes = new Map();
const ballSpeed = 0.02;
let balls = [];
let dragStart = null;

function isInsideGrid(x, y) {
  return x >= 0 && x <= 500 && y >= 0 && y <= 500;
}

function center(c) {
  return { x: c.col * 25 + 12.5, y: c.row * 25 + 12.5 };
}

function key(c) {
  return `${c.col},${c.row}`;
}

function findCell(col, row) {
  return window.getActiveCells().find((c) => c.col === col && c.row === row);
}

new p5(async (p) => {
  p.setup = async () => {
    p.createCanvas(500, 500);
    await window.startAudio();

    p.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const rect = p.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!isInsideGrid(x, y)) return;

      const [col, row] = window.getGridPosition(x, y);
      removeCell(col, row);
      rebuildBalls();
    });
  };

  p.draw = () => {
    window.drawGrid(p);

    balls.forEach((ball) => {
      const { current, prev } = ball;
      const neighbors = window.getConnectedCells(current);
      if (!neighbors.length) return;

      let next;
      if (neighbors.length === 1) {
        next = neighbors[0];
        if (prev && next === prev) ball.prev = current;
      } else {
        next = neighbors.find((c) => c !== prev) || neighbors[0];
      }

      const start = center(current);
      const end = center(next);

      const x = start.x + (end.x - start.x) * ball.t;
      const y = start.y + (end.y - start.y) * ball.t;

      p.fill(255, 100, 50, 180);
      p.noStroke();
      p.ellipse(x, y, 20);

      if (!ball.triggered.has(current)) {
        p.fill(255, 255, 100, 200);
        p.ellipse(center(current).x, center(current).y, 25);
      }

      if (!ball.triggered.has(current)) {
        triggerBallNote(current);
        ball.triggered.add(current);
      }

      ball.t += ballSpeed;
      if (ball.t >= 1) {
        ball.prev = current;
        ball.current = next;
        ball.t = 0;
        ball.triggered.clear();
      }
    });
  };

  p.mousePressed = () => {
    if (!isInsideGrid(p.mouseX, p.mouseY)) return;

    const [col, row] = window.getGridPosition(p.mouseX, p.mouseY);
    const cell = window.activateCell(col, row);
    dragStart = cell;
    rebuildBalls();
  };

  p.mouseReleased = () => {
    if (!dragStart || !isInsideGrid(p.mouseX, p.mouseY)) return;

    const [col, row] = window.getGridPosition(p.mouseX, p.mouseY);
    const dragEnd = findCell(col, row);

    if (dragEnd && dragEnd !== dragStart) {
      window.connectCells(dragStart, dragEnd);
      releaseSustainedNote(dragStart);
      releaseSustainedNote(dragEnd);
      rebuildBalls();
    }

    dragStart = null;
  };

  function rebuildBalls() {
    const components = getConnectedComponents();

    const newBalls = components.map((cells) => {
      const existing = balls.find((b) => cells.includes(b.current));
      return existing
        ? existing
        : { current: cells[0], prev: null, t: 0, triggered: new Set() };
    });

    balls = newBalls;
  }

  function getConnectedComponents() {
    const active = window.getActiveCells();
    const hit = new Set();
    const components = [];

    active.forEach((cell) => {
      const k = key(cell);
      if (hit.has(k)) return;

      const stack = [cell];
      const group = [];
      hit.add(k);

      while (stack.length) {
        const c = stack.pop();
        group.push(c);
        window.getConnectedCells(c).forEach((n) => {
          const nk = key(n);
          if (!hit.has(nk)) {
            hit.add(nk);
            stack.push(n);
          }
        });
      }

      components.push(group);
    });

    return components;
  }

  function removeCell(col, row) {
    const k = `${col},${row}`;

    const idx = window.activeCells.findIndex(
      (c) => c.col === col && c.row === row
    );
    if (idx !== -1) window.activeCells.splice(idx, 1);

    for (let i = window.connections.length - 1; i >= 0; i--) {
      if (
        window.connections[i].fromKey === k ||
        window.connections[i].toKey === k
      ) {
        window.connections.splice(i, 1);
      }
    }

    releaseSustainedNote({ col, row });
  }

  function sustainCellNote(cell) {
    const k = key(cell);
    if (!sustainedNotes.has(k)) {
      const note = window.mapToNote(cell.col, cell.row);
      window.noteOn(note);
      sustainedNotes.set(k, note);
    }
  }

  function releaseSustainedNote(cell) {
    const k = key(cell);
    if (sustainedNotes.has(k)) {
      window.noteOff(sustainedNotes.get(k));
      sustainedNotes.delete(k);
    }
  }

  function triggerBallNote(cell) {
    const note = window.mapToNote(cell.col, cell.row);
    window.noteOn(note);
    setTimeout(() => window.noteOff(note), 250);
  }
});
