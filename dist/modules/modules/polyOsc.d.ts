import { OscillatorConstructor, ModularNode } from "../../nodes";
import { FrequencyNote, MidiStream } from "../../midi";
export declare class PolyphonicOscillator {
  private voices;
  private numVoices;
  private voicePriority;
  private Oscillator;
  private context;
  private gain;
  constructor(
    context: AudioContext,
    oscillator: OscillatorConstructor,
    voices: number
  );
  private prepareAddVoice;
  private removeVoiceCount;
  listen(midi: MidiStream): void;
  playNote(frequencyNote: FrequencyNote, duration?: number): void;
  stopNote(frequencyNote: FrequencyNote): void;
  private stopNoteByKey;
  connect(node: AudioNode | ModularNode): void;
  type: string;
}
