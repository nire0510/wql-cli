import getv from 'getv';

export default class Argument {
  value: string;
  args: Argument[] | undefined;

  constructor(astArgsValue: AstArg) {
    switch (astArgsValue.type) {
      case 'column_ref':
        this.value = astArgsValue.column;
        break;
      case 'function':
        this.value = 'method';
        this.args = getv(astArgsValue, 'args.value', []).map((arg: any) => new Argument(arg));
        break;
      case 'string':
        this.value = astArgsValue.value;
        break;
      default:
        throw new Error(`Unknown argument type: ${astArgsValue.type}`);
    }
  }
}
