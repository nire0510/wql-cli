export default class Website {
  url: string;
  alias: string | undefined;

  constructor(url: string, alias?: string) {
    this.url = url;
    this.alias = alias || undefined;
  }
}
