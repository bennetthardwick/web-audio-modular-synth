import { timer } from "rxjs";
import { MidiStream } from "../midi";

export class Synth {
  private midiStream: MidiStream;
  private audioContext: AudioContext;

  constructor(frequency?: number, precision?: number) {
    this.midiStream = new MidiStream(frequency, precision);
    this.audioContext = new AudioContext();
  }

  get midi(): MidiStream {
    return this.midiStream;
  }

  get context(): AudioContext {
    return this.audioContext;
  }

  /**
   * Play a certain note
   * @param note note to be played
   * @param velocity note velocity
   * @param duration duration of the note
   */
  public playNote(note: number, velocity: number, duration?: number): void {
    this.midi.startNote(note, velocity);
    if (duration) {
      timer(duration).subscribe(() => this.midi.stopNote(note));
    }
  }

  /**
   * Stop playing a note (if it doesn't have a duration)
   * @param note note to stop playing
   */
  public stopNote(note: number): void {
    this.midi.stopNote(note);
  }
}
