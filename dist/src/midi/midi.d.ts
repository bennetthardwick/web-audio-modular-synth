import { Observable } from "rxjs";
export interface FrequencyNote extends MidiNote {
  frequency: number;
}
export interface MidiNote {
  note: number;
  type: MidiNoteType;
  velocity: number;
}
export declare type MidiNoteType = "on" | "off";
export declare class MidiStream {
  private noteSubject$;
  private converter;
  constructor(frequency?: number, precision?: number);
  startNote(note: number, velocity: number): void;
  stopNote(note: number): void;
  readonly onNote$: Observable<FrequencyNote>;
  readonly onNoteMidi$: Observable<MidiNote>;
}
