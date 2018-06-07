import { ModularNode } from "..";

export class LFO {
  private oscillator: OscillatorNode;
  private context: AudioContext;
  private waveAmplitude: GainNode;

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
    this.waveAmplitude = this.context.createGain();
    this.waveAmplitude.gain.value = amplitude;
    this.oscillator.connect(this.waveAmplitude);
  }

  /**
   * Connect the oscillator to a node
   * @param node the node to connect to
   */
  public connect(node: AudioNode | ModularNode): void {
    if (node instanceof AudioNode) {
      this.waveAmplitude.connect(node);
    } else {
      this.waveAmplitude.connect(node.outNode);
    }
  }

  /**
   * Start the oscillation
   */
  public start(): void {
    this.oscillator.start();
  }

  /**
   * Stop the oscillation
   */
  public stop(): void {
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
    this.waveAmplitude.gain.value = amplitude;
  }
}
