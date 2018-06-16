import {
  Oscillator,
  OscillatorConstructor,
  SawOscillator,
  SquareOscillator
} from "../../../nodes";

describe("nodes", () => {
  let osc: Oscillator;
  let context: AudioContext;

  describe("oscillators", () => {
    runOscTests("sine", Oscillator);
    runOscTests("sawtooth", SawOscillator);
    runOscTests("square", SquareOscillator);
  });

  function runOscTests(type: string, con: OscillatorConstructor) {
    describe(type, () => {
      beforeEach(() => {
        context = new AudioContext();
        osc = new con(context);
      });

      it("emits an event when a note is stopped", () => {
        jasmine.clock().install();
        const stopped = jasmine.createSpy("stopped");
        osc.release = 1;
        osc.noteStop$.subscribe(() => stopped());
        osc.stop();
        expect(stopped).not.toHaveBeenCalled();
        jasmine.clock().tick(1000);
        expect(stopped).toHaveBeenCalled();
        jasmine.clock().uninstall();
      });

      it("sets a certain frequency", () => {
        for (let i = 0; i < 100; i++) {
          const freq = Math.floor(Math.random() * 2001);
          osc.frequency = freq;
          expect((osc as any).oscillator.frequency.value).toBe(freq);
        }
      });

      it("sets a certain release value", () => {
        for (let i = 0; i < 100; i++) {
          const release = Math.floor(Math.random() * 100) / 100;
          osc.release = release;
          expect((osc as any).envelope.release).toBe(release);
        }
      });

      it("sets a certain attack value", () => {
        for (let i = 0; i < 100; i++) {
          const attack = Math.floor(Math.random() * 100) / 100;
          osc.attack = attack;
          expect((osc as any).envelope.attack).toBe(attack);
        }
      });

      it("defaults to a " + type + " oscillator", () => {
        expect((osc as any).oscillator.type).toBe(type);
      });

      it("sets a certain wave type", () => {
        osc.type = "sine";
        expect((osc as any).oscillator.type).toBe("sine");
        osc.type = "sawtooth";
        expect((osc as any).oscillator.type).toBe("sawtooth");
        (osc.type as any) = "asdfajk";
        expect((osc as any).oscillator.type).toBe("sawtooth");
        osc.type = "square";
        expect((osc as any).oscillator.type).toBe("square");
        (osc.type as any) = "sqsdfa";
        expect((osc as any).oscillator.type).toBe("square");
      });
    });
  }
});
