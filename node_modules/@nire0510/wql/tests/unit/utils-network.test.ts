import * as netUtils from '../../src/utils/network';

describe('Network Utility', () => {
  test('getIpAddress - should return the right IP address of a hostname', async () => {
    const ip = await netUtils.getIpAddress('www.example.com');

    expect(ip).toBe('93.184.216.34');
  });

  test('isUrlExists - should return true if URL does exists', async () => {
    const exampleExists = await netUtils.isUrlExists('https://www.example.com');
    const dummyExists = await netUtils.isUrlExists('https://www.1q2w3eewq123.com');

    expect(exampleExists).toBeTruthy();
    expect(dummyExists).toBeFalsy();
  });
});

