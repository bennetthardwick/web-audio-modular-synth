import { ComputerKeyboard } from "../../../midi";
import { Subscription } from "rxjs";

describe("midi", () => {
  describe("computer keyboard", () => {
    let sub = new Subscription();

    beforeEach(() => {
      sub = new Subscription();
    });

    afterEach(() => {
      sub.unsubscribe();
    });

    it("plays a note correclty", done => {
      const keyboard = new ComputerKeyboard(window);
      sub = keyboard.midi.onNote$.subscribe(note => {
        expect(note.note).toBe(60);
        expect(note.type).toBe("on");
        done();
      });
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "z"
        })
      );
    });

    it("stops a note correctly", done => {
      const keyboard = new ComputerKeyboard(window);
      sub = keyboard.midi.onNote$.subscribe(note => {
        expect(note.note).toBe(61);
        expect(note.type).toBe("off");
        done();
      });
      window.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "s"
        })
      );
    });
  });
});
