import getv from 'getv';
import nsq from 'node-sql-parser';
import Order from '../../models/order';
import Property from '../../models/property';
import Query from '../../models/query';
import * as validator from './validator';
import Website from '../../models/website';
import Where from '../../models/where';

const parser = new nsq.Parser();

function astObjectToQuery(astObject: any): Query[] {
  try {
    const queries: Query[] = [];

    astObject.from.forEach((astObjectFrom: any) => {
      const { from, ...astObjectExceptfrom } = astObject;
      astObjectExceptfrom.from = [astObjectFrom];
      const website = new Website(astObjectFrom.table, astObjectFrom.as);
      const properties = getv(astObject, 'columns', [{ expr: { type: 'string', value: '*' } }]).map(
        (column: any) => new Property(column)
      );
      const where = new Where(astObject.where);
      const order = (getv(astObject, 'orderby', []) || []).map((order: any) => new Order(order));

      if (validator.postValidate(properties, where)) {
        const query = new Query(
          parser.sqlify(astObjectExceptfrom),
          website,
          properties,
          where,
          order,
          astObject.distinct,
          getv(astObject, 'limit.value.0.value')
        );

        queries.push(query);
      }
    });

    if (astObject.union && astObject._next) {
      return queries.concat(astObjectToQuery(astObject._next));
    }

    return queries;
  } catch (error) {
    throw new Error(`Failed to transform ast object to query: ${error}`);
  }
}

export default function parse(query: string): Query[] {
  try {
    const ast: any = parser.astify(query);
    const queries: Query[] = [];
    const validation = validator.preValidate(ast, query);

    if (!validation.valid) {
      throw new Error(`Invalid query: ${validation.message}`);
    }

    (!Array.isArray(ast) ? [ast] : ast).forEach((astObject) => {
      queries.push(...astObjectToQuery(astObject));
    });

    return queries;
  } catch (error) {
    throw new Error(`Failed to parse query: ${error}`);
  }
}
