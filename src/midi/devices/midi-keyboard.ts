/**
 * THANKS TO: https://github.com/cwilso/monosynth/blob/gh-pages/index.htm
 */

import { MidiStream } from "..";

export class MidiKeyboard {
  public midi: MidiStream;
  private window: Window;

  constructor(window: Window, frequency?: number, precision?: number) {
    this.midi = new MidiStream(frequency, precision);
    this.window = window;
    this.window.navigator
      .requestMIDIAccess()
      .then(midi => this.onMidiAccept(midi))
      .catch(this.onMidiReject);
  }

  private onMidiAccept(midi: WebMidi.MIDIAccess): void {
    this.hookUpInputs(midi);
    midi.onstatechange = () => this.hookUpInputs(midi);
  }

  private hookUpInputs(midi: WebMidi.MIDIAccess): void {
    const inputs = midi.inputs.values();
    for (
      let input = inputs.next();
      input && !input.done;
      input = inputs.next()
    ) {
      input.value.onmidimessage = e => this.midiEventHandler(e);
    }
  }

  private midiEventHandler(event: WebMidi.MIDIMessageEvent): void {
    switch (event.data[0] & 0xf0) {
      case 0x90:
        if (event.data[2] !== 0) {
          this.midi.startNote(event.data[1], event.data[2]);
          return;
        }
      case 0x80:
        this.midi.stopNote(event.data[1]);
        return;
    }
  }

  private onMidiReject(): void {
    throw Error("MIDI not detected in browser...");
  }
}
