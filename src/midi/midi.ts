import { Observable, Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { MidiConversion, noteBuilder } from ".";

export interface FrequencyNote extends MidiNote {
  frequency: number;
}

export interface MidiNote {
  note: number;
  type: MidiNoteType;
  velocity: number;
}

export type MidiNoteType = "on" | "off";

export class MidiStream {
  private noteSubject$ = new Subject<MidiNote>();
  private converter: MidiConversion;

  /**
   * Create a midi stream that handles midi notes
   */
  constructor(frequency?: number, precision?: number) {
    this.converter = new MidiConversion(frequency, precision);
  }

  /**
   * Start playing a note
   * @param note the note to be played
   * @param velocity the velocity that the note is played at
   */
  public startNote(note: number, velocity: number): void {
    this.noteSubject$.next(noteBuilder(note, "on", velocity));
  }

  /**
   * Stop playing a certain note
   * @param note the note to be stopped
   */
  public stopNote(note: number): void {
    this.noteSubject$.next(noteBuilder(note, "off", 0));
  }

  /**
   * A stream of midi notes using frequencies
   */
  get onNote$(): Observable<FrequencyNote> {
    return this.noteSubject$.asObservable().pipe(
      map(note => ({
        ...note,
        frequency: this.converter.noteToFreq(note.note)
      }))
    );
  }

  /**
   * A stream of midi notes
   */
  get onNoteMidi$(): Observable<MidiNote> {
    return this.noteSubject$.asObservable();
  }

  /**
   * Listen to an external midi stream
   * @param midi the midi stream to be joined
   */
  public join(midi: MidiStream): Subscription {
    return midi.onNote$.subscribe(note => this.noteSubject$.next(note));
  }

  /**
   * Stop listening to an external midi stream
   * @param sub the subscription to stop
   */
  public remove(sub: Subscription): void {
    sub.unsubscribe();
  }
}
