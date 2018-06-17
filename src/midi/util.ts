import { MidiNote, MidiNoteType } from ".";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";

/**
 * Generate a midi note
 * @param note the midi note
 * @param type the type of midi note
 * @param velocity the velocity of the midi note
 */
export function noteBuilder(
  note: number,
  type: MidiNoteType,
  velocity: number
): MidiNote {
  return { note, type, velocity };
}

/**
 * An observable that fires at a certain audio context time
 * @param context the current audio context
 * @param offset the amount of time in the future to fire
 */
export function onContextEvent(
  context: AudioContext,
  offset: number
): Observable<void> {
  return new Observable<void>(observer => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    gain.gain.value = 0;
    gain.connect(context.destination);
    osc.connect(gain);
    osc.start(context.currentTime);
    osc.onended = () => {
      observer.next();
      observer.complete();
      osc.disconnect();
      gain.disconnect();
    };
    osc.stop(context.currentTime + offset);
  }).pipe(first());
}
