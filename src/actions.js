const wql = require('@nire0510/wql');

module.exports = {
  getExamples: function () {
    const examples = [
      {
        description: 'Get page source code',
        code: `wql 'SELECT html FROM "https://www.google.com";'`,
      },
      {
        description: 'Get all images URLs with a width greater than 100px and a height between 200px and 300px',
        code: `wql 'SELECT attr(src) FROM "https://www.google.com" WHERE width > "100px" AND height BETWEEN "200px" AND "300px";'`,
      },
      {
        description: 'Get class names of all images',
        code: `wql 'SELECT attr("class") AS img_class FROM "https://www.google.com" WHERE selector = "img";'`,
      },
    ];

    return examples;
  },
  runQuery: async function (query, options) {
    const output = await wql(query, options);

    return output;
  },
};
