import { MidiStream } from '../midi';
export declare class Synth {
    private _midi;
    private _context;
    constructor(frequency?: number, precision?: number);
    readonly midi: MidiStream;
    readonly context: AudioContext;
    playNote(note: number, velocity: number, duration?: number): void;
    stopNote(note: number): void;
}
