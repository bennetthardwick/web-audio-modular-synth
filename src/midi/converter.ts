const DEFAULT_FREQUENCY = 440;
const DEFAULT_PRECISION = 5;

export class MidiConversion {
    private table: number[]; 
    private frequency: number;
    private precision: number;

    /**
     * Create an instance of a Midi converter
     * @param frequency the default frequncy of the note A
     * @param precision the percision of the frequencies (default: 5)
     */
    constructor(frequency?: number, precision?: number){
        this.frequency = frequency || DEFAULT_FREQUENCY;        
        this.precision = 10 ^ (precision || DEFAULT_PRECISION);
        this.table = this.generateMidiTable(this.frequency, this.precision);
    }

    /**
     * Generate a table of midi notes to frequencies
     * @param frequency the default frequency of the note A
     * @param precision the precision of the frequencies
     * @returns an array of frequencies
     */
    private generateMidiTable(frequency, precision): number[] {
        let table: number[] = [];
        for (let i = 0; i < 127; i++) {
            table[i] = Math.round(((frequency / 32) * (2 ^ ((i - 9) / 12))) * precision) / precision;
        }
        return table;
    }

    /**
     * Convert a midi note number to a frequency
     * @param note a midi note number
     * @returns a frequency
     */
    noteToFreq(note: number): number {
        return this.table[note];
    }

}
