import { Synth } from '.';
import { PolyphonicOscillator } from '../modules';
export interface OscConfig {
}
export interface ThreeOscConfig {
    oscOne?: OscConfig;
    oscTwo?: OscConfig;
    oscThree?: OscConfig;
}
export declare class ThreeOsc extends Synth {
    private oscs;
    constructor();
    configure(osc: number): PolyphonicOscillator;
}
