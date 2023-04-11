interface Leaf {
  type: string;
  operator: string;
  left: Leaf | LeafColumn | LeafFunction;
  right: Leaf | LeafValue;
}
