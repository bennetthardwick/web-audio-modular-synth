import { Synth } from '.';
import { PolyphonicOscillator } from '../modules';
import { TriangleOscillator, Oscillator, SquareOscillator } from '../nodes';

export interface OscConfig {

}

export interface ThreeOscConfig {
    oscOne?: OscConfig;
    oscTwo?: OscConfig;
    oscThree?: OscConfig;
}

const OSC_ONE = 0;
const OSC_TWO = 1;
const OSC_THREE = 2;

export class ThreeOsc extends Synth {
    private oscs: PolyphonicOscillator[];
    constructor() {
        super(440, 5);
        this.oscs = [ 
            new PolyphonicOscillator(this.context, TriangleOscillator, 5),
            new PolyphonicOscillator(this.context, Oscillator, 5),
            new PolyphonicOscillator(this.context, SquareOscillator, 5)
        ];
        this.oscs.forEach(osc => osc.listen(this.midi));
        this.oscs.forEach(osc => osc.connect(this.context.destination));
    }

    /**
     * Configure a certain oscillator
     * @param osc the number of the osc (starting at 0)
     */
    configure(osc: number): PolyphonicOscillator {
        switch(osc) {
            case OSC_ONE:
            return this.oscs[OSC_ONE];
            case OSC_TWO:
            return this.oscs[OSC_TWO];
            default:
            case OSC_THREE:
            return this.oscs[OSC_THREE];
        }
    }

}