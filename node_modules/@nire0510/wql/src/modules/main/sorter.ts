import _ from 'lodash';
import getv from 'getv';
import Order from '../../models/order';

export default function order(data: KeyValue[], order: Order[]): KeyValue[] {
  if (Array.isArray(order) && order.length > 0) {
    return _.orderBy(
      data,
      order.map((order: Order) => order.alias || order.name),
      order.map((order: Order) => getv(order, 'direction', 'asc').toLowerCase()) as ('asc' | 'desc')[]
    );
  }

  return data;
}
