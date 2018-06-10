import { Synth } from ".";
import { PolyphonicOscillator } from "../modules";
import { TriangleOscillator } from "../nodes";

export interface OscConfig {
  attack?: number;
}

export interface ThreeOscConfig {
  oscOne?: OscConfig;
  oscTwo?: OscConfig;
  oscThree?: OscConfig;
}

export const enum Oscs {
  ONE,
  TWO,
  THREE
}

const DEFAULT_PRECOMPRESSOR_VALUE = 0.5;

export class ThreeOsc extends Synth {
  public volume: GainNode;
  private compressor: DynamicsCompressorNode;
  private preCompressor: GainNode;
  private oscs: PolyphonicOscillator[];
  constructor() {
    super(440, 0);
    this.volume = this.context.createGain();
    this.compressor = this.context.createDynamicsCompressor();
    this.preCompressor = this.context.createGain();
    this.oscs = [
      new PolyphonicOscillator(this.context, TriangleOscillator, 5),
      new PolyphonicOscillator(this.context, TriangleOscillator, 5),
      new PolyphonicOscillator(this.context, TriangleOscillator, 5)
    ];
    this.oscs.forEach(osc => osc.listen(this.midi));
    this.oscs.forEach(osc => osc.connect(this.preCompressor));
    this.preCompressor.connect(this.compressor);
    this.preCompressor.gain.value = DEFAULT_PRECOMPRESSOR_VALUE;
    this.compressor.connect(this.volume);
    this.volume.connect(this.context.destination);
  }

  /**
   * Configure a certain oscillator
   * @param osc the number of the osc (starting at 0)
   */
  public configure(osc: Oscs): PolyphonicOscillator {
    return this.oscs[osc];
  }
}
