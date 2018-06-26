import { timer } from "rxjs";
import { MidiStream, MidiDevice } from "../midi";

export class Synth {
  private midiStream: MidiStream;
  private audioContext: AudioContext;

  /**
   * Create an instance of a synth
   * @param frequency the frequency of an A note
   * @param precision the precision of the frequencies
   */
  constructor(context: AudioContext, frequency?: number, precision?: number) {
    this.midiStream = new MidiStream(frequency, precision);
    this.audioContext = context;
  }

  /**
   * The internal midi stream this synth uses
   */
  get midi(): MidiStream {
    return this.midiStream;
  }

  /**
   * The context this synth uses
   */
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

  /**
   * Listen to a midi stream
   * @param midi midi stream to listen to
   */
  public listen({ midi }: MidiDevice) {
    midi.onNote$.subscribe(note => {
      if (note.type === "on") {
        this.playNote(note.note, note.velocity);
      } else if (note.type === "off") {
        this.stopNote(note.note);
      }
    });
  }
}
