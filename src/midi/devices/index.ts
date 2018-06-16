import { MidiStream } from "..";

export * from "./computer-keyboard";
export * from "./midi-keyboard";

export interface MidiDevice {
  midi: MidiStream;
}
