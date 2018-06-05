import { MidiStream } from '../midi';
import { PolyphonicOscillator } from '../modules';
import { SawOscillator } from '../nodes';
import { timer, interval } from 'rxjs';

export class Synth {

    private midi: MidiStream;
    private context: AudioContext;

    constructor(frequency?: number, precision?: number) {
        this.midi = new MidiStream(frequency, precision);
        this.context = new AudioContext();

        let osc = new PolyphonicOscillator(this.context, SawOscillator, 5);
        osc.connect(this.context.destination);
        osc.listen(this.midi);

        interval(1500).subscribe(() => {
            this.playNote(69, 100, 200);
        });

        timer(1000).subscribe(() => {
            interval(1500).subscribe(() => {
                this.playNote(76, 100, 200);
            });
        })
        
        timer(500).subscribe(() => {
            interval(1500).subscribe(() => {
                this.playNote(72, 100, 200);
            });
        });


    }
    
    playNote(note: number, velocity: number, duration: number): void {
        this.midi.startNote(note, velocity);
        timer(duration).subscribe(() => this.midi.stopNote(note));
    }

}
