import { Synth } from "../../synth";
import { MidiStream } from "../../midi";
import { filter, tap } from "rxjs/operators";

describe("synth", () => {
  let synth: Synth;
  let context: AudioContext;

  beforeEach(() => {
    context = new AudioContext();
    synth = new Synth(context);
  });

  afterEach(() => {
    context.close();
  });

  it("returns a midi stream", () => {
    expect(synth.midi instanceof MidiStream);
  });

  it("returns the audio context", () => {
    expect(synth.context).toBe(context);
  });

  it("plays a note", () => {
    const velocity = 50;
    const midiNote = 20;
    const noteType = "on";
    synth.midi.onNote$.subscribe(note => {
      expect(note.velocity).toBe(velocity);
      expect(note.note).toBe(midiNote);
      expect(note.type).toBe(noteType);
    });
    synth.playNote(midiNote, velocity);
  });

  it("stops playing a note", () => {
    const velocity = 50;
    const midiNote = 40;
    const noteType = "off";
    const spy = jasmine.createSpy("notePlayed");
    synth.midi.onNote$
      .pipe(
        tap(() => spy()),
        filter(note => note.type === noteType)
      )
      .subscribe(note => {
        expect(note.note).toBe(midiNote);
        expect(note.velocity).toBe(0);
      });
    synth.playNote(midiNote, velocity);
    synth.stopNote(midiNote);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
