import { ModularNode } from '..';

const DEFAULT_GAIN = 0.1;
const DEAFAULT_ENVEOPE = {
    attack: 0.01,
    release: 0.02,
    decay: 0.001,
    sustain: 0.001
}

export interface OscillatorConstructor {
    new(context: AudioContext, frequency: number, config?: OscillatorConfig): Oscillator
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
    evelope?: OscillatorEnvelopeOptions
}

export class Oscillator implements ModularNode {

    private oscillator: OscillatorNode;
    private context: AudioContext;
    private gain: GainNode;
    private envelope: OscillatorEnvelope;

    /**
     * Create an instance of a sine oscillator
     * @param context the audio context
     * @param frequency the frequency of the osc voice
     * @param gain the gain (default: 1)
     */
    constructor(context: AudioContext, frequency: number, config?: OscillatorConfig) {
        this.context = context;
        this.oscillator = this.context.createOscillator();
        this.oscillator.frequency.value = frequency;
        this.gain = this.context.createGain();
        this.gain.gain.value = (config ? config.gain : undefined) || DEFAULT_GAIN;
        this.oscillator.connect(this.gain);
        this.envelope = { ...DEAFAULT_ENVEOPE, ...(config ? config.evelope : null) }; 
    }

    /**
     * Connect the oscillator to an audio node
     * @param node an HTML5 audio node or ModularNode
     */
    connect(node: AudioNode | ModularNode): void {
        if (node instanceof AudioNode)
            this.gain.connect(node);
        else {
            this.gain.connect(node.outNode);
        }
    }
    
    /**
     * Start the osc
     */
    start() {
        this.oscillator.start();
        this.gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + this.envelope.attack);
    }

    /**
     * Stop the osc
     */
    stop() {
        this.oscillator.stop(this.context.currentTime + this.envelope.release);
        this.gain.gain.linearRampToValueAtTime(0, this.context.currentTime + this.envelope.release);
    }

    /**
     * The HTML5 node that is the exit for this node
     */
    get outNode(): AudioNode {
        return this.gain;
    }

    /**
     * Set the type of the HTML5 osc
     * @param type wave type
     */
    setType(type: OscillatorType) {
        this.oscillator.type = type;
    }

}

export class SquareOscillator extends Oscillator {
    /**
     * Create an instance of a square wave oscillator
     * @param context the audio context
     * @param frequency the frequency of the osc voice
     * @param gain the gain (default: 1)
     */
    constructor(context: AudioContext, frequency: number, config?: OscillatorConfig) {
        super(context, frequency, config);
        this.setType('square');
    }
}

export class TriangleOscillator extends Oscillator {
    /**
     * Create an instance of a triangle wave oscillator
     * @param context the audio context
     * @param frequency the frequency of the osc voice
     * @param gain the gain (default: 1)
     */
    constructor(context: AudioContext, frequency: number, config?: OscillatorConfig) {
        super(context, frequency, config);
        this.setType('triangle');
    }
} 

export class SawOscillator extends Oscillator {
    /**
     * Create an instance of a saw wave oscillator
     * @param context the audio context
     * @param frequency the frequency of the osc voice
     * @param gain the gain (default: 1)
     */
    constructor(context: AudioContext, frequency: number, config?: OscillatorConfig) {
        super(context, frequency, config);
        this.setType('sawtooth');
    }
} 

export class SineOscillator extends Oscillator {
    /**
     * Create an instance of a sine wave oscillator
     * @param context the audio context
     * @param frequency the frequency of the osc voice
     * @param gain the gain (default: 1)
     */
    constructor(context: AudioContext, frequency: number, config?: OscillatorConfig) {
        super(context, frequency, config);
        this.setType('sine');
    }
} 
