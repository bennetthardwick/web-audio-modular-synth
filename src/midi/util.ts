import { MidiNote, MidiNoteType } from ".";

/**
 * Generate a midi note
 * @param note the midi note
 * @param type the type of midi note
 * @param velocity the velocity of the midi note
 */
export function noteBuilder(note: number, type: MidiNoteType, velocity: number): MidiNote {
    return { note, type, velocity };
}