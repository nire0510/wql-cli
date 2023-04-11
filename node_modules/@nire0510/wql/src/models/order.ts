import Property from './property';

export default class Order extends Property {
  direction: string;

  constructor(astOrder: any) {
    super(astOrder);
    this.direction = astOrder.type;
  }
}
