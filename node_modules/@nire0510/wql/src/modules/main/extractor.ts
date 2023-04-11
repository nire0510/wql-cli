import Browser from '../browser';
import Property from '../../models/property';
import Query from '../../models/query';

export default async function extract(browser: Browser, query: Query): Promise<KeyValue[]> {
  try {
    const data: KeyValue[] = (await browser.executeScript(async (query: Query) => {
      const selector = query.where && Array.isArray(query.where.selectors) && query.where.selectors.join(', ') || '*';
      let elements: any;

      function mapper(property: Property, element: any): string | null | KeyValue | undefined {
        let value;

        switch (property.type) {
          case 'method':
            switch (property.name) {
              case 'attr':
                value = (element as Element).getAttribute(property.args![0].value);
                break;
              case 'data':
                value = (element as HTMLElement).dataset[property.args![0].value];
                break;
              case 'style':
                const propertyValue = property
                  .args![0].value.replace(/([a-z\d])([A-Z])/g, '$1-$2')
                  .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1-$2')
                  .toLowerCase();
                value = window.getComputedStyle((element as Element)).getPropertyValue(propertyValue);
                break;
              default:
                throw new Error(`Unknown method property: ${property.name}`);
            }
            break;
          case 'preset':
            switch (property.name) {
              case 'headers':
                value = (element as Element).textContent;
                break;
              case 'html':
                value = (element as Element).outerHTML;
                break;
              case 'images':
                value = (element as Element).getAttribute('src');
                break;
              case 'links':
                value = (element as Element).getAttribute('href');
                break;
              case 'scripts':
                value = (element as Element).getAttribute('src');
                break;
              case 'stylesheets':
                value = (element as CSSStyleSheet).href ||
                Array.from((element as CSSStyleSheet).cssRules)
                  .map((rule) => rule.cssText)
                  .join('');
                break;
              case 'tables':
                const columns = Array.from(
                  element.querySelectorAll('thead th, thead td, tr:first-child > th, tr:first-child > td')
                ).map((th: any) => th.textContent || '');

                value = Array.from(element.querySelectorAll('tr'))
                  .filter((tr, index) => index > 1 || columns.length === 0)
                  .map((tr: any) => {
                    const row: { [key: string]: any } = {};

                    Array.from(tr.querySelectorAll('td, th')).forEach(
                      (td: any, index) => (row[(columns && columns[index]) || `col${index}`] = td.textContent)
                    );

                    return row;
                  });
                break;
              case 'tag':
                value = (element as Element).tagName;
                break;
              case 'text':
                value = (element as Element).textContent;
                break;
              default:
                throw new Error(`Unknown preset property: ${property.name}`);
            }
            break;
          default:
            throw new Error(`Unknown property type: ${property.type}`);
        }

        return value;
      }

      ['headers', 'images', 'links', 'scripts', 'stylesheets', 'tables'].forEach((preset: string) => {
        if (query.properties.map((property: Property) => property.name).includes(preset)) {
          switch (preset) {
            case 'headers':
              elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
              break;
            case 'images':
              elements = document.images;
              break;
            case 'links':
              elements = document.links;
              break;
            case 'scripts':
              elements = document.scripts;
              break;
            case 'stylesheets':
              elements = document.styleSheets;
              break;
            case 'tables':
              elements = document.querySelectorAll('table');
              break;
          }
        }
      });

      return Array.from(elements || document.querySelectorAll(selector)).map((element) => {
        const row: KeyValue = {};

        for (const property of query.properties) {
          row[property.alias || property.name] = mapper(property, element);
        }

        if (query.where && Array.isArray(query.where.properties)) {
          query.where.properties.forEach((property) => {
            if (property.name in row === false) {
              row[property.name] = mapper(property, element);
            }
          });
        }

        if (query.order) {
          for (const order of query.order) {
            if (order.name in row === false) {
              row[order.name] = mapper(order, element);
            }
          }
        }

        return row;
      });
    }, query)) as KeyValue[];

    return data;
  } catch (error) {
    throw new Error(`Unable to extract data: ${error}`);
  }
}
