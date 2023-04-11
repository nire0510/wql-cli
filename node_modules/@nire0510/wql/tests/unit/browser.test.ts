import Browser from '../../src/modules/browser';

describe('Browser Service', () => {
  const browser = new Browser({} as Options);

  afterAll(async () => {
    await browser.close();
  });

  test('should navigate to using goto', async () => {
    const response = await browser.goto('https://www.example.com');

    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200); // 200 is the status code we
  });

  test('should extract link href attribute using getAttribute', async () => {
    expect((await browser.getAttribute('a', 'href'))[0]).toBe('https://www.iana.org/domains/example');
  });

  test('should extract h1 content using getContent', async () => {
    expect((await browser.getContent('h1') as string[])[0]).toBe('Example Domain');
  });

  // test('should extract h1 data attribute using getData', async () => {

  // });

  test('should extract h1 markaup using getHtml', async () => {
    expect((await browser.getHtml('h1'))[0]).toBe('<h1>Example Domain</h1>');
  });

  test('should extract a link element font color using getHtml', async () => {
    expect((await browser.getStyle('a', 'color'))[0]).toBe('rgb(56, 72, 143)');
  });

  test('should return the webpage title using getTitle', async () => {
    expect(await browser.getTitle()).toBe('Example Domain');
  });
});

