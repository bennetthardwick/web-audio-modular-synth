import { timer } from "rxjs";
import { FrequencyNote, MidiStream } from "../../midi";
import {
  ModularNode,
  Oscillator,
  OscillatorConstructor,
  Envelopable
} from "../../nodes";
import { first } from "rxjs/operators";

const DEFAULT_GAIN = 0.5;
const DEFAULT_VOICE_COUNT = 10;

export class PolyphonicOscillator implements Envelopable {
  private voices: { [key: string]: Oscillator } = {};
  private queue: Oscillator[] = [];
  private oscillators: Oscillator[] = [];
  private numVoices: number;
  private voiceCount = 0;
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
    voices?: number
  ) {
    this.Oscillator = oscillator;
    this.context = context;
    this.gain = this.context.createGain();
    this.gain.gain.value = DEFAULT_GAIN;
    this.numVoices = voices || DEFAULT_VOICE_COUNT;
    this.generateVoices();
  }

  /**
   * Listen to a midi stream
   * @param midi the midi stream to listen to
   */
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
      if (this.voiceCount === this.numVoices) {
        return;
      }
      const osc = this.queue.pop();
      if (osc === undefined) {
        return;
      }
      this.voices[note] = osc;
      this.voices[note].frequency = frequencyNote.frequency;
      this.voiceCount++;
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
    const voc = this.voices[note];
    delete this.voices[note];
    voc.noteStop$.pipe(first()).subscribe(() => {
      this.queue.push(voc);
      this.voiceCount--;
    });
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
  set type(type: OscillatorType) {
    this.oscillators.forEach(osc => (osc.type = type));
  }

  set release(release: number) {
    this.oscillators.forEach(osc => (osc.release = release));
  }

  set attack(attack: number) {
    this.oscillators.forEach(osc => (osc.attack = attack));
  }

  private generateVoices(): void {
    for (let i = 0; i < this.numVoices; i++) {
      this.queue[i] = new this.Oscillator(this.context, 440);
      this.queue[i].connect(this.gain);
      this.oscillators[i] = this.queue[i];
    }
  }
}
