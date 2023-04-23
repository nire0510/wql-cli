const wql = require('@nire0510/wql');

module.exports = {
  getExamples: function () {
    const examples = [
      {
        description: 'Get page source code of Google.com',
        code: `wql 'SELECT html FROM "https://www.google.com";'`,
      },
      {
        description: 'Get all images URLs with 56px width from BBC',
        code: `wql 'SELECT attr("src") AS img_src, style("width") FROM "https://www.bbc.com" WHERE selector = "img" AND style("width") = "56px";'`,
      },
      {
        description: 'Get class names of all DIVs from Google',
        code: `wql 'SELECT attr("class") AS img_class FROM "https://www.google.com" WHERE selector = "div";'`,
      },
      {
        description: 'Get the biggest title from CNN & BBC',
        code: `wql 'SELECT text, style("fontSize") FROM "https://edition.cnn.com/", "https://www.bbc.com/" WHERE selector IN ("h1", "h2", "h3", "h4", "h5", "h6") ORDER BY style("fontSize") DESC LIMIT 1;'`,
      },
    ];

    return examples;
  },
  runQuery: async function (query, options) {
    const output = await wql(query, options);

    return output;
  },
};
