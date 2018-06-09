import { fromEvent } from "rxjs";
import { ThreeOsc } from "./synth";

const synth = new ThreeOsc();

synth.playNote(57, 100, 10000);
synth.playNote(69, 100, 10000);
synth.playNote(72, 100, 10000);
synth.playNote(76, 100, 10000);
