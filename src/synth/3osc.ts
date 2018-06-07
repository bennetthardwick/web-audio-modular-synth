import { Synth } from ".";
import { PolyphonicOscillator } from "../modules";
import { Oscillator, SquareOscillator, TriangleOscillator } from "../nodes";

export interface OscConfig {}

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
  public configure(osc: Oscs): PolyphonicOscillator {
    return this.oscs[osc];
  }
}
