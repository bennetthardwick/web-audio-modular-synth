export declare class MidiConversion {
  private table;
  private frequency;
  private precision;
  constructor(frequency?: number, precision?: number);
  private generateMidiTable;
  noteToFreq(note: number): number;
}
