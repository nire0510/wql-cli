import * as fsUtils from './fs.js';

export default async function log(content) {
  const filepath = await fsUtils.writeFile(fsUtils.generateTempFilePath('log'), content);

  return filepath;
}
