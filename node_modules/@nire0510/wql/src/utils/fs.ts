import fs from 'fs';
import os from 'os';
import path from 'path';

export function generateTempFilePath(ext: string): string {
  const filepath = path.join(os.tmpdir(), `${Date.now().toString()}.${ext}`);

  return filepath;
}
