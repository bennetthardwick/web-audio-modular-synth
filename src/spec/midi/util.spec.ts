import { noteBuilder } from "../..//midi/util";
import { MidiNote, MidiNoteType } from "../../midi";

describe("Util", () => {
  describe("midi note builder", () => {
    it("should return a midi note", () => {
      let note = 100;
      let type: MidiNoteType = "on";
      let velocity = 100;

      let midiNote = noteBuilder(100, "on", 100);
      expect(midiNote).toEqual({ note, type, velocity });
    });
  });
});
