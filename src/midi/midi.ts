import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MidiConversion, noteBuilder } from '.';

export interface MidiNote extends BaseNote {
    note: number;
}

export interface FrequencyNote extends BaseNote {
    frequency: number;
}

export interface BaseNote {
    type: MidiNoteType;
    velocity: number;
}

export type MidiNoteType = 
    "on" | "off"

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
     * Start playing a note
     * @param note the note to be played
     * @param velocity the velocity that the note is played at
     */
    startNote(note: number, velocity: number): void {
        this.noteSubject$.next(noteBuilder(note, "on", velocity))
    }

    /**
     * Stop playing a certain note
     * @param note the note to be stopped
     */
    stopNote(note: number): void {
        this.noteSubject$.next(noteBuilder(note, "off", 0));
    }

    /**
     * A stream of midi notes using frequencies
     */
    get onNote$(): Observable<FrequencyNote> {
        return this.noteSubject$
            .asObservable()
            .pipe(map(note => ({ 
                type: note.type, 
                velocity: note.velocity,
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