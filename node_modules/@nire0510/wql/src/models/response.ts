import Meta from './meta.js';

export default class Response {
  data: KeyValue[];
  meta: Meta;

  constructor(browserInfo: BrowserInfo, pageInfo: PageInfo, queryInfo: QueryInfo, data: KeyValue[]) {
    this.meta = new Meta(browserInfo, pageInfo, queryInfo);
    this.data = data;
  }
}
