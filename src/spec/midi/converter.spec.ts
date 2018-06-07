import { MidiConversion } from "../../midi";

describe("midi", () => {
  describe("converter", () => {
    it("has a default precision of 5", () => {
      const convert = new MidiConversion();
      expect(
        convert
          .noteToFreq(100)
          .toString()
          .split(".")[1]
          .split("").length
      ).toBe(5);
    });

    it("generates a table of certain precision", () => {
      const convert = new MidiConversion(440, 2);
      expect(
        convert
          .noteToFreq(100)
          .toString()
          .split(".")[1]
          .split("").length
      ).toBe(2);
    });
  });
});
