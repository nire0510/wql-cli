import os from 'os';
import * as fsUtils from '../../src/utils/fs';

describe('FS Utility', () => {
  test('should generate random file name in temp folder', async () => {
    const filepath = fsUtils.generateTempFilePath('png');
    const tmpdir = os.tmpdir();

    expect(filepath.indexOf(tmpdir) === 0).toBeTruthy();
  });

  test('should generate random file name with specified file extension', async () => {
    expect(fsUtils.generateTempFilePath('png').endsWith('.png')).toBeTruthy();
    expect(fsUtils.generateTempFilePath('pdf').endsWith('.pdf')).toBeTruthy();
    expect(fsUtils.generateTempFilePath('txt').endsWith('.txt')).toBeTruthy();
  });
});

