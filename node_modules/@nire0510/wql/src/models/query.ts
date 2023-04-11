import Order from './order';
import Property from './property';
import Website from './website';
import Where from './where';

export default class Query {
  distinct: boolean;
  order: Order[];
  limit: number;
  properties: Property[];
  statement: string;
  website: Website;
  where: Where;

  constructor(
    statement: string,
    website: Website,
    properties: Property[],
    where: Where,
    order: Order[],
    distinct: boolean,
    limit: number
  ) {
    this.statement = statement;
    this.website = website;
    this.properties = properties;
    this.where = where;
    this.order = order;
    this.distinct = distinct || false;
    this.limit = limit;
  }
}
