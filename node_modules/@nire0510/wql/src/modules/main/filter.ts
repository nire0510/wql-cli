import Where from '../../models/where';

function evaluate(item: KeyValue, leaf: Leaf): boolean {
  if (leaf) {
    if (['AND', 'OR'].includes(leaf.operator)) {
      const left = evaluate(item, leaf.left as Leaf);
      const right = evaluate(item, leaf.right as Leaf);

      return leaf.operator === 'AND' ? left && right : left || right;
    }

    if ((leaf.left as LeafColumn).column === 'selector') {
      return true;
    }

    const left = item[leaf.left.type === 'function' ? (leaf.left as LeafFunction).name : (leaf.left as LeafColumn).column];
    const right: string | number | boolean | Array<number | string | LeafValue> = (leaf.right as LeafValue).value;

    switch (leaf.operator) {
      case '=':
        return left === right;
      case '!=':
        return left !== right;
      case '>':
        return left > right;
      case '>=':
        return left >= right;
      case '<':
        return left < right;
      case '<=':
        return left <= right;
      case 'IN':
        return Array.isArray(right) ? right.map((item) => (item as LeafValue).value).includes(left) : left === right;
      case 'NOT IN':
        return Array.isArray(right) ? !right.map((item) => (item as LeafValue).value).includes(left) : left !== right;
      case 'LIKE':
      case 'NOT LIKE':
        if (typeof right === 'string') {
          const regex = new RegExp(
            `${!right.startsWith('%') ? '^' : ''}${right.replace(/%/g, '')}${!right.endsWith('%') ? '$' : ''}`,
            'ig'
          );

          return left && (leaf.operator === 'LIKE' ? left.match(regex) : !left.match(regex));
        }

        return false;
      case 'BETWEEN':
        return left >= (right as Array<number>)[0] && left <= (right as Array<number>)[1];
      case 'NOT BETWEEN':
        return left < (right as Array<number>)[0] || left > (right as Array<number>)[1];
      default:
        return false;
    }
  }

  return false;
}

export default function filter(data: KeyValue[], where: Where): KeyValue[] {
  if (where && where.tree) {
    return data.filter((item: KeyValue) => evaluate(item, where.tree));
  }

  return data;
}
