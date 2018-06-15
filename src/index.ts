import { ThreeOsc } from "./synth";
import { MidiKeyboard } from "./midi/devices/midi-keyboard";

const synth = new ThreeOsc();

const keyboard = new MidiKeyboard(window);
keyboard.midi.onNote$.subscribe(note => {
  console.log(note);

  if (note.type === "on") {
    synth.playNote(note.note, 100);
  } else {
    synth.stopNote(note.note);
  }
});
