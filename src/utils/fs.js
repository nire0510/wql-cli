import os from 'os';
import fs from 'fs';
import path from 'path';

export function generateTempFilePath(ext) {
  const filepath = path.join(os.tmpdir(), `${Date.now().toString()}.${ext}`);

  return filepath;
}

export async function writeFile(filepath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, (error) => {
      if (error) {
        return reject(error);
      }

      resolve(filepath);
    });
  });
}
