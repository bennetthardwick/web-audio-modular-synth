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

export enum ThreeOscs {
  ONE,
  TWO,
  THREE
}

export class ThreeOsc extends Synth {
  public volume: GainNode;
  private oscs: PolyphonicOscillator[];
  constructor(context: AudioContext) {
    super(context, 440, 0);
    this.volume = this.context.createGain();
    this.oscs = [
      new PolyphonicOscillator(this.context, TriangleOscillator, 10),
      new PolyphonicOscillator(this.context, TriangleOscillator, 10),
      new PolyphonicOscillator(this.context, TriangleOscillator, 10)
    ];
    this.oscs.forEach(osc => osc.listen(this.midi));
    this.oscs.forEach(osc => osc.connect(this.volume));
    this.volume.connect(this.context.destination);
    this.volume.gain.value = 0.2;
  }

  /**
   * Configure a certain oscillator
   * @param osc the number of the osc (starting at 0)
   */
  public configure(osc: ThreeOscs): PolyphonicOscillator {
    return this.oscs[osc];
  }
}
