import { timer } from "rxjs";
import { FrequencyNote, MidiStream } from "../../midi";
import {
  ModularNode,
  Oscillator,
  OscillatorConstructor,
  SawOscillator,
  SquareOscillator,
  TriangleOscillator
} from "../../nodes";

const SIN_OSC = "sine";
const SQUARE_OSC = "square";
const TRIANGE_OSC = "triangle";
const SAW_OSC = "sawtooth";

export class PolyphonicOscillator {
  private voices: { [key: string]: Oscillator } = {};
  private numVoices: number;
  private voicePriority: string[] = [];
  private Oscillator: OscillatorConstructor;
  private context: AudioContext;
  private gain: GainNode;

  /**
   * Create an intstance of a polyphoic oscillator
   * @param context the audio context
   * @param oscillator the type of oscillator to make poly
   * @param voices the number of voices the poly synth can have
   */
  constructor(
    context: AudioContext,
    oscillator: OscillatorConstructor,
    voices: number
  ) {
    this.Oscillator = oscillator;
    this.context = context;
    this.gain = this.context.createGain();
    this.numVoices = voices;
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

  /**
   * Start playing a note
   * @param note a note to be played
   * @param duration optional duration
   */
  public playNote(frequencyNote: FrequencyNote, duration?: number) {
    const note = frequencyNote.note.toString();
    if (!this.voices[note]) {
      this.prepareAddVoice(note);
      this.voices[note] = new this.Oscillator(
        this.context,
        frequencyNote.frequency
      );
      this.voices[note].connect(this.gain);
    } else {
      return;
    }

    if (duration) {
      this.voices[note].start();
      timer(duration).subscribe(() => {
        this.stopNote(frequencyNote);
      });
    } else {
      this.voices[note].start();
    }
  }

  /**
   * Stop playing a certain note
   * @param note a note to be stopped
   */
  public stopNote(frequencyNote: FrequencyNote) {
    const note = frequencyNote.note.toString();
    if (!this.voices[note]) {
      return;
    }
    this.voices[note].stop();
    delete this.voices[note];
    this.removeVoiceCount(note);
  }

  /**
   * Connect the output of the osc
   * @param node the node to connect to
   */
  public connect(node: AudioNode | ModularNode) {
    if (node instanceof AudioNode) {
      this.gain.connect(node);
    } else {
      this.gain.connect(node.outNode);
    }
  }

  /**
   * Set the type of the PolyOsc
   */
  set type(type: string) {
    switch (type) {
      case SAW_OSC:
        this.Oscillator = SawOscillator;
        break;
      case SIN_OSC:
        this.Oscillator = Oscillator;
        break;
      case SQUARE_OSC:
        this.Oscillator = SquareOscillator;
        break;
      case TRIANGE_OSC:
        this.Oscillator = TriangleOscillator;
        break;
    }
  }

  private prepareAddVoice(voice: string): void {
    this.voicePriority.push(voice);
    if (this.voicePriority.length > this.numVoices) {
      this.stopNoteByKey(this.voicePriority.shift() as string);
    }
  }

  private removeVoiceCount(voice: string): void {
    const index = this.voicePriority.indexOf(voice);
    if (index > -1) {
      this.voicePriority.splice(index, 1);
    }
  }

  private stopNoteByKey(key: string) {
    if (!this.voices[key]) {
      return;
    }
    this.voices[key].stop();
  }
}
