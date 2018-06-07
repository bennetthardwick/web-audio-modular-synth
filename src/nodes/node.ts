export interface ModularNode {
  connect: (node: AudioNode) => void;
  outNode: AudioNode;
}
