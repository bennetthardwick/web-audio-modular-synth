import { FrequencyNote, MidiStream } from "../../midi";

describe("midi", () => {
  describe("stream", () => {
    const frequency = 440;
    const precision = 0;

    const onNote: FrequencyNote = {
      frequency: 440,
      note: 69,
      type: "on",
      velocity: 100
    };

    const offNote: FrequencyNote = {
      ...onNote,
      type: "off"
    };

    it("creates an instance of midi stream", () => {
      const midiStream = new MidiStream(frequency, precision);
      expect(midiStream instanceof MidiStream);
    });

    it("plays a onNote", () => {
      const midiStream = new MidiStream(frequency, precision);
      midiStream.onNote$.subscribe(n => {
        expect(n.frequency).toBe(onNote.frequency);
        expect(n.note).toBe(onNote.note);
        expect(n.velocity).toBe(onNote.velocity);
        expect(n.type).toBe(onNote.type);
      });
      midiStream.startNote(onNote.note, onNote.velocity);
    });

    it("stops playing a onNote", () => {
      const midiStream = new MidiStream(frequency, precision);
      midiStream.startNote(offNote.note, offNote.velocity);
      midiStream.onNote$.subscribe(n => {
        expect(n.frequency).toBe(offNote.frequency);
        expect(n.note).toBe(offNote.note);
        expect(n.velocity).toBe(0);
        expect(n.type).toBe("off");
      });
      midiStream.stopNote(offNote.note);
    });

    it("should correctly convert notes to frequencies", () => {
      const table = {
        "100": 2637,
        "60": 262,
        "69": 440
      };

      const midiStream = new MidiStream(frequency, precision);
      midiStream.onNote$.subscribe(n => {
        expect(n.frequency).toBe(table[n.note]);
      });
      midiStream.startNote(100, 100);
      midiStream.startNote(60, 100);
      midiStream.startNote(69, 100);
    });
  });
});
