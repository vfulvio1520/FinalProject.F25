window.canvasSize = 500;
window.gridSize = 25;
window.activeCells = [];
window.connections = [];

window.drawGrid = function (p) {
  p.background(245);

  p.stroke(200);
  for (let x = 0; x <= window.canvasSize; x += window.gridSize) {
    p.line(x, 0, x, window.canvasSize);
  }
  for (let y = 0; y <= window.canvasSize; y += window.gridSize) {
    p.line(0, y, window.canvasSize, y);
  }

  p.stroke(0, 150, 255);
  p.strokeWeight(2);
  window.connections.forEach((c) => {
    const a = getCellByKey(c.fromKey);
    const b = getCellByKey(c.toKey);
    if (a && b) {
      p.line(
        a.col * window.gridSize + window.gridSize / 2,
        a.row * window.gridSize + window.gridSize / 2,
        b.col * window.gridSize + window.gridSize / 2,
        b.row * window.gridSize + window.gridSize / 2
      );
    }
  });

  window.activeCells.forEach((c) => {
    p.noStroke();
    p.fill(0, 150, 255, 160);
    p.rect(
      c.col * window.gridSize,
      c.row * window.gridSize,
      window.gridSize,
      window.gridSize
    );
  });
};

window.getGridPosition = function (x, y) {
  return [Math.floor(x / window.gridSize), Math.floor(y / window.gridSize)];
};

window.activateCell = function (col, row) {
  let cell = window.activeCells.find((c) => c.col === col && c.row === row);
  if (!cell) {
    cell = { col, row };
    window.activeCells.push(cell);
  }
  return cell;
};

window.deactivateCell = function (col, row) {
  const key = `${col},${row}`;
  for (let i = window.connections.length - 1; i >= 0; i--) {
    if (
      window.connections[i].fromKey === key ||
      window.connections[i].toKey === key
    ) {
      window.connections.splice(i, 1);
    }
  }
  const idx = window.activeCells.findIndex(
    (c) => c.col === col && c.row === row
  );
  if (idx !== -1) window.activeCells.splice(idx, 1);
};

window.connectCells = function (a, b) {
  const ka = `${a.col},${a.row}`;
  const kb = `${b.col},${b.row}`;
  if (
    !window.connections.some(
      (c) =>
        (c.fromKey === ka && c.toKey === kb) ||
        (c.fromKey === kb && c.toKey === ka)
    )
  ) {
    window.connections.push({ fromKey: ka, toKey: kb });
  }
};

window.getConnectedCells = function (cell) {
  const key = `${cell.col},${cell.row}`;
  return window.connections
    .filter((c) => c.fromKey === key || c.toKey === key)
    .map((c) =>
      c.fromKey === key ? getCellByKey(c.toKey) : getCellByKey(c.fromKey)
    )
    .filter(Boolean);
};

window.getActiveCells = function () {
  return window.activeCells;
};

window.getCellByKey = function (key) {
  return window.activeCells.find((c) => `${c.col},${c.row}` === key);
};
