import { fromEvent } from "rxjs";
import { MidiStream, MidiDevice } from "..";
import { filter } from "rxjs/operators";

const KEYBOARD_SCALE: { [key: string]: number } = {
  z: 0,
  s: 1,
  x: 2,
  d: 3,
  c: 4,
  v: 5,
  g: 6,
  b: 7,
  h: 8,
  n: 9,
  j: 10,
  m: 11,
  ",": 12,
  q: 12,
  l: 13,
  "2": 13,
  ".": 14,
  w: 14,
  ";": 15,
  "3": 15,
  "/": 16,
  e: 16,
  r: 17,
  "5": 18,
  t: 19,
  "6": 20,
  y: 21,
  "7": 22,
  u: 23,
  i: 24,
  "9": 25,
  o: 26,
  "0": 27,
  p: 28
};

const BASE_NOTE = 60;
const BASE_VELOCITY = 100;

export class ComputerKeyboard implements MidiDevice {
  public midi: MidiStream;
  private window: Window;

  constructor(window: Window, frequency?: number, precision?: number) {
    this.window = window;
    this.midi = new MidiStream(frequency, precision);
    this.handleKeyDown();
    this.handleKeyUp();
  }

  private handleKeyDown() {
    fromEvent<KeyboardEvent>(this.window, "keydown")
      .pipe(filter(event => Object.keys(KEYBOARD_SCALE).includes(event.key)))
      .subscribe(event =>
        this.midi.startNote(
          KEYBOARD_SCALE[event.key] + BASE_NOTE,
          BASE_VELOCITY
        )
      );
  }

  private handleKeyUp() {
    fromEvent<KeyboardEvent>(this.window, "keyup")
      .pipe(filter(event => Object.keys(KEYBOARD_SCALE).includes(event.key)))
      .subscribe(event =>
        this.midi.stopNote(KEYBOARD_SCALE[event.key] + BASE_NOTE)
      );
  }
}
