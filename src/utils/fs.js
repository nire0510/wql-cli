import { writeFile as wf } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export function generateTempFilePath(ext) {
  const filepath = join(tmpdir(), `${Date.now().toString()}.${ext}`);

  return filepath;
}

export async function writeFile(filepath, content) {
  return new Promise((resolve, reject) => {
    wf(filepath, content, (error) => {
      if (error) {
        return reject(error);
      }

      resolve(filepath);
    });
  });
}
