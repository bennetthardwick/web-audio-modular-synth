export declare class Synth {
    private midi;
    private context;
    constructor(frequency?: number, precision?: number);
    playNote(note: number, velocity: number, duration: number): void;
}
