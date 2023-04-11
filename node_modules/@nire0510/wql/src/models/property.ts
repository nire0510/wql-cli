import getv from 'getv';
import Argument from './argument';

export default class Property {
  name: string;
  alias: string | undefined;
  type: string;
  args: Argument[] | undefined;

  constructor(astColumn: any) {
    const column = astColumn.expr || astColumn;

    this.alias = astColumn.as;
    switch (column.type) {
      case 'column_ref':
        this.name = column.column;
        this.type = 'preset';
        break;
      case 'aggr_func':
        this.name = column.name.toLowerCase();
        this.type = 'method';
        this.args = [new Argument(column.args.expr)];
        if (!this.alias) {
          this.alias = `${this.name}(${this.args.map((arg) => arg.value).join(', ')})`;
        }
        break;
      case 'function':
        this.name = column.name;
        this.type = 'method';
        this.args = getv(column, 'args.value', []).map((arg: any) => new Argument(arg));
        if (!this.alias) {
          this.alias = `${this.name}(${this.args!.map((arg) => arg.value).join(', ')})`;
        }
        break;
      default:
        throw new Error(`Unknown column type: ${column.type}`);
    }
  }
}
