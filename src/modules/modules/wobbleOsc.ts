import { MidiStream, FrequencyNote } from "../../midi";
import { Oscillator, OscillatorConstructor } from "../../nodes";

export class WobbleOscillator {
  private voice: Oscillator;
  private Oscillator: OscillatorConstructor;
  private context: AudioContext;
  private gain: GainNode;
  private compressor: DynamicsCompressorNode;

  constructor(
    context: AudioContext,
    oscillator: OscillatorConstructor,
    voice: Oscillator
  ) {
    this.voice = voice;
    this.context = context;
    this.Oscillator = oscillator;
    this.compressor = this.context.createDynamicsCompressor();
    this.gain.connect(this.compressor);
  }

  public listen(midi: MidiStream) {
    midi.onNote$.subscribe(note => {
      if (note.type === "on") {
        this.playNote(note);
      } else if (note.type === "off") {
        this.stopNote(note);
      }
    });
  }

  public playNote(frequencyNote: FrequencyNote, duration?: number) {
    const note = frequencyNote.note.toString();
    if (!this.voice) {
      this.prepareAddVoice(note);
      this.voice = new this.Oscillator(this.context, frequencyNote.frequency);
      this.voice.connect(this.gain);
    } else {
      return;
    }
  }
}
