const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = {
  generateTempFilePath: function (ext) {
    const filepath = path.join(os.tmpdir(), `${Date.now().toString()}.${ext}`);

    return filepath;
  },
  writeFile: async function (filepath, content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filepath, content, (error) => {
        if (error) {
          return reject(error);
        }

        resolve(filepath);
      });
    });
  },
};
