## Requirements Analysis

My music-related software project will be a [geoboard](https://apps.mathlearningcenter.org/geoboard/) that allows users to draw shapes or overlay images on a grid-based geoboard and map those visual elements to musical parameters. The geometric and visual forms correspond to audio/MIDI data, allowing real-time synthesis and manipulation, as well as recording/export capabilities.

---

### Use Cases

- Shape-based sound generation
  - User-drawn shapes and lines correspond to tone and rhythm based on shape dimensions and coordinates within the grid
- Image overlay
  - User-uploaded image characteristics such as color, pixel density, and boundaries modulate audio parameters
- Real-time dynamic manipulation
- Recording/Exporting as .wav, .mp3, and .mid
- Users select from stock database of sounds/samples and modifies their playback using geometry

---

### System Requirements

- Functional Requirements

  - Interactive geoboard for drawing and manipulating shapes
  - Real-time audio generation/synthesis, mapped to shape dimensions and coordinates
  - Integrated sound database with control over audio parameters
  - MIDI note and control generated from geometric data
  - Export audio and MIDI data

- Technical Requirements
  - SVG rendering for shapes
  - React + Tone.js for synthesis
  - WebMIDI API for MIDI integration
  - Node.js for file export and sound library
  - Local storage

---

### Constraints and Limitations

- Browser limits on audio processing and sample rate
- JavaScript timing + latency constraints
- Polyphony + parameter mapping constraints
- Complex geometric-to-audio mapping
