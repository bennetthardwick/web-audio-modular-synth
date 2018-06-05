import { ModularNode } from '..';
export interface OscillatorConstructor {
    new (context: AudioContext, frequency: number, config?: OscillatorConfig): Oscillator;
}
export interface OscillatorEnvelopeOptions {
    attack?: number;
    release?: number;
    decay?: number;
    sustain?: number;
}
export interface OscillatorEnvelope {
    attack: number;
    release: number;
    decay: number;
    sustain: number;
}
export interface OscillatorConfig {
    gain?: number;
    evelope?: OscillatorEnvelopeOptions;
}
export declare class Oscillator implements ModularNode {
    private oscillator;
    private context;
    private gain;
    private envelope;
    constructor(context: AudioContext, frequency: number, config?: OscillatorConfig);
    connect(node: AudioNode | ModularNode): void;
    start(): void;
    stop(): void;
    readonly outNode: AudioNode;
    setType(type: OscillatorType): void;
}
export declare class SquareOscillator extends Oscillator {
    constructor(context: AudioContext, frequency: number, config?: OscillatorConfig);
}
export declare class TriangleOscillator extends Oscillator {
    constructor(context: AudioContext, frequency: number, config?: OscillatorConfig);
}
export declare class SawOscillator extends Oscillator {
    constructor(context: AudioContext, frequency: number, config?: OscillatorConfig);
}
export declare class SineOscillator extends Oscillator {
    constructor(context: AudioContext, frequency: number, config?: OscillatorConfig);
}
