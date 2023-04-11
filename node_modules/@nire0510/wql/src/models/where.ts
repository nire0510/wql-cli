import Property from './property';

export default class Where {
  properties: Property[];
  selectors: string[];
  tree: Leaf;

  constructor(astWhere: any) {
    this.tree = astWhere;
    this.properties = this.extract(this.tree, 'properties');
    this.selectors = this.extract(this.tree, 'selectors');
  }

  private extract(leaf: any, type: string): any {
    if (leaf) {
      if (['AND', 'OR'].includes(leaf.operator)) {
        return this.extract(leaf.left, type).concat(this.extract(leaf.right, type));
      } else {
        if (type === 'selectors' && leaf.left.column === 'selector') {
          return Array.isArray(leaf.right.value)
            ? leaf.right.value.map((value: any) => value.value)
            : [leaf.right.value || leaf.right.column];
        } else if (type === 'properties' && leaf.left.column !== 'selector') {
          return [new Property(leaf.left)];
        }
      }
    }

    return [];
  }
}
