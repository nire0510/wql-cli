const fsUtils = require('./fs.js');

module.exports = async function log (content) {
  const filepath = await fsUtils.writeFile(fsUtils.generateTempFilePath('log'), content);

  return filepath;
};
