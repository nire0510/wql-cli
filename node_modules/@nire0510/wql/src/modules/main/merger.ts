import _ from 'lodash';

export default function distinct(data: KeyValue[], apply: boolean): KeyValue[] {
  if (apply) {
    return _.uniqWith(data, _.isEqual);
  }

  return data;
}
