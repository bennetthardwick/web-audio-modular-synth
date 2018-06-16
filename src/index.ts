import { ThreeOsc, ThreeOscs } from "./synth";
import { ComputerKeyboard } from "./midi";

const keyboard = new ComputerKeyboard(window);
const synth = new ThreeOsc();

synth.configure(ThreeOscs.ONE).attack = 0.1;
synth.configure(ThreeOscs.TWO).release = 2;
synth.configure(ThreeOscs.TWO).type = "sine";

synth.listen(keyboard);
