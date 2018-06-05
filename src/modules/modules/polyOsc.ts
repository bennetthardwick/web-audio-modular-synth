import { Oscillator, OscillatorConstructor, ModularNode } from '../../nodes';
import { FrequencyNote, MidiStream } from '../../midi';
import { timer } from 'rxjs';

export class PolyphonicOscillator {

    private voices: { [key: string]: Oscillator } = {};
    private numVoices: number;
    private voicePriority: string[] = [];
    private Oscillator: OscillatorConstructor;
    private context: AudioContext;
    private gain: GainNode;

    /**
     * Create an intstance of a polyphoic oscillator
     * @param context the audio context
     * @param oscillator the type of oscillator to make poly
     * @param voices the number of voices the poly synth can have 
     */
    constructor(context: AudioContext, oscillator: OscillatorConstructor, voices: number) {
        this.Oscillator = oscillator;
        this.context = context;
        this.gain = this.context.createGain();
        this.numVoices = voices;
    }

    private prepareAddVoice(voice: string): void {
        this.voicePriority.push(voice);
        if (this.voicePriority.length > this.numVoices) {
            this.stopNoteByKey(this.voicePriority.shift() as string);
        }
    }

    private removeVoiceCount(voice: string): void {
        let index = this.voicePriority.indexOf(voice);
        if (index > -1) this.voicePriority.splice(index, 1);
    }

    listen(midi: MidiStream) {
        midi.onNote$.subscribe(note => {
            if (note.type === "on") this.playNote(note);
            else if (note.type === "off") this.stopNote(note);
        });
    }

    /**
     * Start playing a note 
     * @param note a note to be played
     * @param duration optional duration
     */
    playNote(frequencyNote: FrequencyNote, duration?: number) {

        console.log(this.voicePriority);

        let note = frequencyNote.note.toString();
        if (!this.voices[note]) {
            this.prepareAddVoice(note);
            this.voices[note] = new this.Oscillator(this.context, frequencyNote.frequency);
            this.voices[note].connect(this.gain);
        }
        else return;

        if (duration) {
            this.voices[note].start();
            timer(duration).subscribe(() => {
                this.stopNote(frequencyNote);
            });
        }
        else this.voices[note].start();
    }

    /**
     * Stop playing a certain note
     * @param note a note to be stopped
     */
    stopNote(frequencyNote: FrequencyNote) {
        let note = frequencyNote.note.toString();
        if (!this.voices[note]) return;
        this.voices[note].stop();
        delete this.voices[note];
        this.removeVoiceCount(note)
    }

    private stopNoteByKey(key: string) {
        if (!this.voices[key]) return;
        this.voices[key].stop();
    }

    /**
     * Connect the output of the osc
     * @param node the node to connect to 
     * */
    connect(node: AudioNode | ModularNode) {
        if (node instanceof AudioNode) {
            this.gain.connect(node);
        } else {
            this.gain.connect(node.outNode);
        }
    }

}
