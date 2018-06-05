import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MidiConversion } from '.';

export class MidiStream {

    private noteSubject$ = new Subject<MidiNote>();
    private converter: MidiConversion;

    /**
     * Create a midi stream that handles midi notes
     */
    constructor() {
        this.converter = new MidiConversion()
    }

    /**
     * A stream of midi notes using frequencies
     */
    get onNote$(): Observable<FrequencyNote> {
        return this.noteSubject$
            .asObservable()
            .pipe(map(note => ({ 
                type: note.type, 
                frequency: this.converter.noteToFreq(note.note)
            })));
    }

    /**
     * A stream of midi notes
     */
    get onNoteMidi$(): Observable<MidiNote> {
        return this.noteSubject$
            .asObservable();
    }

}

export interface MidiNote {
    type: number;
    note: number;
}

export interface FrequencyNote {
    type: number;
    frequency: number;
}
