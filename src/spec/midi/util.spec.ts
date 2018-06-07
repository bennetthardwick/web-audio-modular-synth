import { noteBuilder } from "../..//midi/util";
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
});
