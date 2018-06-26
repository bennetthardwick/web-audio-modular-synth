import { FrequencyNote, MidiStream } from "../../midi";
import { keys } from "./devices/computer-keyboard.spec";
import { midiKeys } from "./devices/midi-keyboard.spec";

describe("midi", () => {
  describe("stream", () => {
    const frequency = 440;
    const precision = 0;
    let midiStream: MidiStream;

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

    beforeEach(() => {
      midiStream = new MidiStream(frequency, precision);
    });

    it("creates an instance of midi stream", () => {
      expect(midiStream instanceof MidiStream);
    });

    it("plays a onNote", () => {
      midiStream.onNote$.subscribe(n => {
        expect(n.frequency).toBe(onNote.frequency);
        expect(n.note).toBe(onNote.note);
        expect(n.velocity).toBe(onNote.velocity);
        expect(n.type).toBe(onNote.type);
      });
      midiStream.startNote(onNote.note, onNote.velocity);
    });

    it("stops playing a onNote", () => {
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

      midiStream.onNote$.subscribe(n => {
        expect(n.frequency).toBe(table[n.note]);
      });
      midiStream.startNote(100, 100);
      midiStream.startNote(60, 100);
      midiStream.startNote(69, 100);
    });

    it("should return a stream of notes without frequencies", () => {
      midiStream.onNoteMidi$.subscribe(n => {
        expect(n.note).toBe(100);
        expect(n.velocity).toBe(100);
        expect((n as any).frequency).toBe(undefined);
      });
      midiStream.startNote(100, 100);
    });

    it("should join together two streams", () => {
      const stream = new MidiStream(100, 0);
      const spy = jasmine.createSpy("notePlayed");
      midiStream.onNote$.subscribe(() => spy());
      midiStream.join(stream);

      stream.startNote(100, 100);
      stream.startNote(98, 100);

      expect(spy).toHaveBeenCalledTimes(2);

      midiStream.startNote(96, 100);
      midiStream.startNote(97, 100);

      expect(spy).toHaveBeenCalledTimes(4);
    });
  });

  keys();
  midiKeys();
});
