import { ModularNode } from "..";

export class LFO {
  private oscillator: OscillatorNode;
  private context: AudioContext;
  private _amplitude: GainNode;

  /**
   * Create an instance of a low frequency oscillator
   * @param context the audio context
   * @param frequency the frequency of the lfo
   * @param amplitude the amplitude of the lfo
   */
  constructor(context: AudioContext, frequency: number, amplitude: number) {
    this.context = context;
    this.oscillator = this.context.createOscillator();
    this.oscillator.frequency.value = frequency;
    this._amplitude = this.context.createGain();
    this._amplitude.gain.value = amplitude;
    this.oscillator.connect(this._amplitude);
  }

  /**
   * Connect the oscillator to a node
   * @param node the node to connect to
   */
  connect(node: AudioNode | ModularNode): void {
    if (node instanceof AudioNode) {
      this._amplitude.connect(node);
    } else {
      this._amplitude.connect(node.outNode);
    }
  }

  /**
   * Start the oscillation
   */
  start(): void {
    this.oscillator.start();
  }

  /**
   * Stop the oscillation
   */
  stop(): void {
    this.oscillator.stop();
  }

  /**
   * Set the type of lfo (shape)
   */
  set type(type: OscillatorType) {
    this.oscillator.type = type;
  }

  /**
   * Set the frequency of the lfo
   */
  set frequency(frequency: number) {
    this.oscillator.frequency.value = frequency;
  }

  /**
   * Set the amplitude of the lfo
   */
  set amplitude(amplitude: number) {
    this._amplitude.gain.value = amplitude;
  }
}
