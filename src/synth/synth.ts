import { MidiStream } from "../midi";
import { timer } from "rxjs";

export class Synth {
  private _midi: MidiStream;
  private _context: AudioContext;

  constructor(frequency?: number, precision?: number) {
    this._midi = new MidiStream(frequency, precision);
    this._context = new AudioContext();
  }

  get midi(): MidiStream {
    return this._midi;
  }

  get context(): AudioContext {
    return this._context;
  }

  /**
   * Play a certain note
   * @param note note to be played
   * @param velocity note velocity
   * @param duration duration of the note
   */
  playNote(note: number, velocity: number, duration?: number): void {
    this.midi.startNote(note, velocity);
    if (duration) timer(duration).subscribe(() => this.midi.stopNote(note));
  }

  /**
   * Stop playing a note (if it doesn't have a duration)
   * @param note note to stop playing
   */
  stopNote(note: number): void {
    this.midi.stopNote(note);
  }
}
