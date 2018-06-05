import { MidiNote } from ".";

export function noteBuilder(note: number, type: number): MidiNote {
    return { note, type };
}