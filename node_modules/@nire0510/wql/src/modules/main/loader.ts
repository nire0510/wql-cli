import Browser from '../browser';

export default async function load(url: string, options: Options): Promise<Browser> {
  try {
    const browser = new Browser(options);
    const waitPreset = ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'].some((preset) => preset === options.wait);

    await browser.goto(url, {
      waitUntil: waitPreset && options.wait || 'networkidle2',
    });

    !waitPreset && options.wait && await browser.waitForSelector(options.wait, {
      visible: true,
    });

    return browser;
  } catch (error) {
    throw new Error(`Unable to open browser and navigate to ${url}: ${error}`);
  }
}
