import { MidiStream } from '../midi';
import { timer } from 'rxjs';

export class Synth {

    private _midi: MidiStream;
    private _context: AudioContext;

    constructor(frequency?: number, precision?: number) {
        this._midi = new MidiStream(frequency, precision);
        this._context = new AudioContext();
    }

    get midi(): MidiStream {
        return this._midi;
    }

    get context(): AudioContext {
        return this._context;
    }
    
    playNote(note: number, velocity: number, duration?: number): void {
        this.midi.startNote(note, velocity);
        if (duration) timer(duration).subscribe(() => this.midi.stopNote(note));
    }

    stopNote(note: number) {
        this.midi.stopNote(note);
    }

}
