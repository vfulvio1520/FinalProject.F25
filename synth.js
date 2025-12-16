let synth;
const env = {
  attack: 0.05,
  decay: 0.3,
  sustain: 0.7,
  release: 0.5,
};

window.startAudio = async function () {
  if (Tone.context.state !== "running") await Tone.start();
};

function Synth() {
  if (synth) return;

  synth = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 12,
    oscillator: { type: "sine" },
    volume: -12,
    envelope: { ...env },
  }).toDestination();
}

window.noteOn = (note) => {
  Synth();
  synth.triggerAttack(note);
};

window.noteOff = (note) => {
  if (!synth) return;
  synth.triggerRelease(note);
};

function bindSlider(id, label, cb, fmt) {
  const el = document.getElementById(id);
  const lab = document.getElementById(label);
  if (!el || !lab) return;

  el.addEventListener("input", () => {
    const v = parseFloat(el.value);
    cb(v);
    lab.textContent = fmt(v);
  });
}

//attack
bindSlider(
  "attTime",
  "attLabel",
  (v) => {
    env.attack = v;
    if (synth) synth.set({ envelope: { ...env } });
  },
  (v) => `${Math.round(v * 1000)} ms`
);

//decay
bindSlider(
  "decTime",
  "decLabel",
  (v) => {
    env.decay = v;
    if (synth) synth.set({ envelope: { ...env } });
  },
  (v) => `${Math.round(v * 2500)} ms`
);

//sustain
bindSlider(
  "susAmp",
  "susLabel",
  (v) => {
    env.sustain = v;
    if (synth) synth.set({ envelope: { ...env } });
  },
  (v) => v.toFixed(2)
);

//release
bindSlider(
  "relTime",
  "relLabel",
  (v) => {
    env.release = v;
    if (synth) synth.set({ envelope: { ...env } });
  },
  (v) => `${Math.round(v * 5000)} ms`
);
