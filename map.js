const gridSize = 25;
const canvasSize = 500;
const gridRows = canvasSize / gridSize;

window.mapToNote = function (col, row) {
  const baseMidi = 48;

  const verticalOffset = gridRows - 1 - row;

  const midi = baseMidi + col + verticalOffset;

  const midiToNote = Math.max(0, Math.min(127, midi));

  return Tonal.Midi.midiToNoteName(midiToNote);
};
