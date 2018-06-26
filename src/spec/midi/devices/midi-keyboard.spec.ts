import { MidiKeyboard, MidiStream } from "../../../midi";
import { take } from "rxjs/operators";

export const REJECTING_WINDOW_STUB = {
  navigator: {
    requestMIDIAccess: () => Promise.reject()
  }
} as Window;

export const midiKeys = () =>
  describe("midi keyboard", () => {
    it("it throws an error when the window rejects", () => {
      const keyboard = new MidiKeyboard(REJECTING_WINDOW_STUB);
      expect((keyboard as any).onMidiReject).toThrow();
    });

    it("handles midi events correctly", () => {
      const keyboard = new MidiKeyboard(window);
      const noteSpy = jasmine.createSpy("notePlayed");
      keyboard.midi.onNote$.subscribe(note => noteSpy());
      keyboard.midi.onNote$.pipe(take(1)).subscribe(note => {
        expect(note.note).toBe(100);
        expect(note.type).toBe("on");
        expect(note.velocity).toBe(100);
      });
      (keyboard as any).midiEventHandler({
        data: [0x90, 100, 100]
      });
      keyboard.midi.onNote$.pipe(take(1)).subscribe(note => {
        expect(note.note).toBe(100);
        expect(note.type).toBe("off");
        expect(note.velocity).toBe(0);
      });
      (keyboard as any).midiEventHandler({
        data: [0x90, 100, 0]
      });
      keyboard.midi.onNote$.pipe(take(1)).subscribe(note => {
        expect(note.note).toBe(100);
        expect(note.type).toBe("off");
        expect(note.velocity).toBe(0);
      });
      (keyboard as any).midiEventHandler({
        data: [0x80, 100, 0]
      });
      expect(noteSpy).toHaveBeenCalledTimes(3);
    });
  });
