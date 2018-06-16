import { ModularNode } from "..";
import { Observable, Subject, timer } from "rxjs";

const DEAFAULT_ENVEOPE = {
  attack: 1,
  decay: 0.001,
  release: 0.02,
  sustain: 1
};

const DEFAULT_DETUNE_SHIFT = 0.01;

export interface OscillatorConstructor {
  new (
    context: AudioContext,
    frequency: number,
    config?: OscillatorConfig
  ): Oscillator;
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
  evelope?: OscillatorEnvelopeOptions;
}

export class Oscillator implements ModularNode {
  private oscillator: OscillatorNode;
  private context: AudioContext;
  private gain: GainNode;
  private envelope: OscillatorEnvelope;
  private noteStopSubject = new Subject<void>();

  /**
   * Create an instance of a sine oscillator
   * @param context the audio context
   * @param frequency the frequency of the osc voice
   * @param gain the gain (default: 1)
   */
  constructor(
    context: AudioContext,
    frequency?: number,
    config?: OscillatorConfig
  ) {
    this.context = context;
    this.oscillator = this.context.createOscillator();
    this.oscillator.frequency.value = frequency || 440;
    this.envelope = {
      ...DEAFAULT_ENVEOPE,
      ...(config ? config.evelope : null)
    };
    this.gain = this.context.createGain();
    this.gain.gain.value = 0;
    this.oscillator.connect(this.gain);
    this.oscillator.start();
  }

  /**
   * Connect the oscillator to an audio node
   * @param node an HTML5 audio node or ModularNode
   */
  public connect(node: AudioNode | ModularNode): void {
    if (node instanceof AudioNode) {
      this.gain.connect(node);
    } else {
      this.gain.connect(node.outNode);
    }
  }

  /**
   * Start the osc
   */
  public start() {
    this.gain.gain.linearRampToValueAtTime(
      this.envelope.sustain,
      this.context.currentTime + this.envelope.attack
    );
  }

  /**
   * Stop the osc
   */
  public stop() {
    this.gain.gain.cancelScheduledValues(this.context.currentTime);
    this.gain.gain.setValueAtTime(
      this.gain.gain.value,
      this.context.currentTime
    );
    this.gain.gain.linearRampToValueAtTime(
      0,
      this.context.currentTime + this.envelope.release
    );
    timer(this.envelope.release / 1000).subscribe(() =>
      this.noteStopSubject.next()
    );
  }

  /**
   * The HTML5 node that is the exit for this node
   */
  get outNode(): AudioNode {
    return this.gain;
  }

  /**
   * The envelope attack amount
   */
  set attack(attack: number) {
    this.envelope.attack = attack;
  }

  /**
   * The envelope release amount
   */
  set release(release: number) {
    this.envelope.release = release;
  }

  /**
   * Set an amount to detune to osc by
   */
  set detune(detune: number) {
    this.oscillator.detune.linearRampToValueAtTime(
      detune,
      this.context.currentTime + DEFAULT_DETUNE_SHIFT
    );
  }

  /**
   * Set the current frequency of the oscillator
   */
  set frequency(frequency: number) {
    this.oscillator.frequency.value = frequency;
  }

  /**
   * Set an lfo to modulate pitch
   */
  set pitchLFO(modulator: AudioDestinationNode) {
    modulator.connect(this.oscillator.frequency);
  }

  /**
   * Set an lfo to modulate volume
   */
  set volumeLFO(modulator: AudioDestinationNode) {
    modulator.connect(this.gain.gain);
  }

  /**
   * Set the type of the HTML5 osc
   */
  set type(type: OscillatorType) {
    this.oscillator.type = type;
  }

  get noteStop$(): Observable<void> {
    return this.noteStopSubject.asObservable();
  }
}

export class SquareOscillator extends Oscillator {
  /**
   * Create an instance of a square wave oscillator
   * @param context the audio context
   * @param frequency the frequency of the osc voice
   * @param gain the gain (default: 1)
   */
  constructor(
    context: AudioContext,
    frequency: number,
    config?: OscillatorConfig
  ) {
    super(context, frequency, config);
    this.type = "square";
  }
}

export class TriangleOscillator extends Oscillator {
  /**
   * Create an instance of a triangle wave oscillator
   * @param context the audio context
   * @param frequency the frequency of the osc voice
   * @param gain the gain (default: 1)
   */
  constructor(
    context: AudioContext,
    frequency: number,
    config?: OscillatorConfig
  ) {
    super(context, frequency, config);
    this.type = "triangle";
  }
}

export class SawOscillator extends Oscillator {
  /**
   * Create an instance of a saw wave oscillator
   * @param context the audio context
   * @param frequency the frequency of the osc voice
   * @param gain the gain (default: 1)
   */
  constructor(
    context: AudioContext,
    frequency: number,
    config?: OscillatorConfig
  ) {
    super(context, frequency, config);
    this.type = "sawtooth";
  }
}
