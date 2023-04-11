export default class ResponseMeta {
  browser: BrowserInfo;
  page: PageInfo;
  query: QueryInfo;

  constructor(browserInfo: BrowserInfo, pageInfo: PageInfo, queryInfo: QueryInfo) {
    this.browser = browserInfo;
    this.page = pageInfo;
    this.query = {
      ...queryInfo,
    };
  }
}
