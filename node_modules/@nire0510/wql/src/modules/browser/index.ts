import getv from 'getv';
import puppeteer, { ElementHandle, Browser as PuppeteerBrowser, Page, HTTPResponse, EvaluateFunc, Protocol, NodeFor } from 'puppeteer';

export default class Browser {
  browser: PuppeteerBrowser | null;
  initialized = false;
  options: Options;
  page: Page | null;

  constructor(options: Options) {
    this.browser = null;
    this.options = options;
    this.page = null;
  }

  async _init() {
    if (!this.initialized) {
      const args = [
        // '--autoplay-policy=user-gesture-required',
        // '--disable-background-networking',
        // '--disable-background-timer-throttling',
        // '--disable-backgrounding-occluded-windows',
        // '--disable-breakpad',
        // '--disable-client-side-phishing-detection',
        // '--disable-component-update',
        // '--disable-default-apps',
        // '--disable-dev-shm-usage',
        // '--disable-domain-reliability',
        // '--disable-extensions',
        // '--disable-features=AudioServiceOutOfProcess',
        // '--disable-hang-monitor',
        // '--disable-ipc-flooding-protection',
        // '--disable-notifications',
        // '--disable-offer-store-unmasked-wallet-cards',
        // '--disable-popup-blocking',
        // '--disable-print-preview',
        // '--disable-prompt-on-repost',
        // '--disable-renderer-backgrounding',
        // '--disable-setuid-sandbox',
        // '--disable-speech-api',
        // '--disable-sync',
        '--enable-automation',
        // '--hide-scrollbars',
        // '--ignore-gpu-blacklist',
        // '--metrics-recording-only',
        // '--mute-audio',
        // '--no-default-browser-check',
        // '--no-first-run',
        // '--no-pings',
        // '--no-sandbox',
        // '--no-zygote',
        // '--password-store=basic',
        // '--use-gl=swiftshader',
        // '--use-mock-keychain',
        '--profile-directory=Default',
      ];

      this.browser = await puppeteer.launch({
        // args,
        defaultViewport: getv(this.options, 'viewport', {
          height: 720,
          width: 1080,
        }),

        headless: getv(this.options, 'headless', true),
        userDataDir: getv(this.options, 'userDataDir', undefined),
        executablePath: getv(this.options, 'executablePath', undefined),
      });
      this.page = await this.browser.newPage();
      if (getv(this.options, 'turbo', false)) {
        await this.page.setRequestInterception(true);
        this.page.on('request', (request) => {
          if (['font', 'image', 'stylesheet'].includes(request.resourceType())) {
            request.abort();
          } else {
            request.continue();
          }
        });
      }
      this.initialized = true;
    }

    return Promise.resolve();
  }

  $$eval(selector: string, mapper: Function): Promise<Array<string>> {
    return this.page!.$$eval(
      selector,
      (elementHandles: Element[], mapper: Function) => elementHandles.map((element: any) => mapper(element)),
      mapper
    );
  }

  close(): Promise<void> {
    return this.browser!.close();
  }

  evaluate(
    elementHandles: ElementHandle | Array<ElementHandle>,
    fnc: EvaluateFunc<unknown[]>
  ): Promise<Awaited<ReturnType<EvaluateFunc<unknown[]>>>> {
    return this.page!.evaluate(fnc, elementHandles);
  }

  getAttribute(selector: string, attribute: string): Promise<Array<string | null>> {
    return this.page!.$$eval(
      selector,
      (elements: Element[], attribute: string) => elements.map((element: Element) => element.getAttribute(attribute)),
      attribute
    );
  }

  getContent(selector: string | null): Promise<Array<string | null> | string | unknown> {
    if (selector === null) {
      return this.page!.content();
    }

    return this.page!.$$eval(selector, (elements: Element[]) => elements.map((element: Element) => element.textContent));
  }

  getCookies(): Promise<Protocol.Network.Cookie[]> {
    return this.page!.cookies();
  }

  getData(selector: string, attribute: string): Promise<Array<string>> {
    return this.page!.$$eval(
      selector,
      (elements: Element[], attribute: string) => elements.map((element: any) => element.dataset[attribute]),
      attribute
    );
  }

  getHtml(selector: string): Promise<Array<string>> {
    return this.page!.$$eval(selector, (elements: Element[]) => elements.map((element: Element) => element.outerHTML));
  }

  getStyle(selector: string, property: string): Promise<Array<string>> {
    return this.page!.$$eval(
      selector,
      (elements: Element[], property: string) =>
        elements.map((element: Element) => window.getComputedStyle(element).getPropertyValue(property)),
      property
    );
  }

  getTitle(): Promise<string> {
    return this.page!.title();
  }

  getUserAgent(): Promise<string> {
    return this.browser!.userAgent();
  }

  async goto(url: string, options?: any): Promise<HTTPResponse | null> {
    await this._init();

    return this.page!.goto(url, options);
  }

  executeScript(fnc: any, ...args: any): Promise<unknown> {
    return this.page!.evaluate(fnc, ...args);
  }

  pdf(filepath: string): Promise<Buffer> {
    return this.page!.pdf({
      path: filepath,
    });
  }

  screenshot(filepath: string): Promise<Buffer> {
    return this.page!.screenshot({
      fullPage: true,
      path: filepath,
    });
  }

  waitForSelector(selector: string, options?: any): Promise<ElementHandle<NodeFor<string>> | null> {
    return this.page!.waitForSelector(selector, options);
  }

  waitForNavigation(): Promise<HTTPResponse | null> {
    return this.page!.waitForNavigation();
  }

  waitForNetworkIdle(): Promise<void> {
    return this.page!.waitForNetworkIdle();
  }
}
