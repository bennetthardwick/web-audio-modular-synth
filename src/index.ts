import { ThreeOsc } from "./synth";
import { ComputerKeyboard } from "./midi/devices/computer-keyboard";

const synth = new ThreeOsc();

const keyboard = new ComputerKeyboard(window);
keyboard.midi.onNote$.subscribe(note => {
  if (note.type === "on") {
    synth.playNote(note.note, 100);
  } else {
    synth.stopNote(note.note);
  }
});
