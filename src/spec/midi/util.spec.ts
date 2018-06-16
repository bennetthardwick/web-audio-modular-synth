import { noteBuilder, onContextEvent } from "../..//midi/util";
import { MidiNote, MidiNoteType } from "../../midi";

describe("Util", () => {
  describe("midi note builder", () => {
    it("should return a midi note", () => {
      const note = 100;
      const type: MidiNoteType = "on";
      const velocity = 100;

      const midiNote = noteBuilder(100, "on", 100);
      expect(midiNote).toEqual({ note, type, velocity });
    });
  });
  describe("Context Event Scheduler", () => {
    let context: AudioContext;

    beforeEach(() => {
      context = new AudioContext();
    });

    afterEach(() => {
      context.close();
    });

    it("emits at a certain time", done => {
      onContextEvent(context, 2).subscribe(() => {
        expect(true).toBe(true);
        done();
      });
    });
  });
});
