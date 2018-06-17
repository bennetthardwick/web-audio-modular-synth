import { ThreeOsc, ThreeOscs } from "./synth";
import { MidiKeyboard } from "./midi";

const keyboard = new MidiKeyboard(window);
const synth = new ThreeOsc();

synth.configure(ThreeOscs.ONE).type = "sine";
synth.configure(ThreeOscs.TWO).type = "sine";
synth.configure(ThreeOscs.THREE).type = "sine";

synth.configure(ThreeOscs.ONE).release = 0.1;
synth.configure(ThreeOscs.TWO).release = 0.1;
synth.configure(ThreeOscs.THREE).release = 0.1;

synth.configure(ThreeOscs.ONE).attack = 0.05;
synth.configure(ThreeOscs.TWO).attack = 0.05;
synth.configure(ThreeOscs.THREE).attack = 0.05;

synth.listen(keyboard);
