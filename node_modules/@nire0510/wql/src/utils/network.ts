import dns from 'dns';
import https from 'https';
import net from 'net';

export function getIpAddress(hostname: string): Promise<string> {
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, (err, address) => {
      if (err) {
        return reject(err);
      }

      resolve(address);
    });
  });
}

export function isUrlExists(url: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    https
      .request(url, { method: 'HEAD' }, (res) => {
        if (res && res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
          return resolve(true);
        }

        return resolve(false);
      })
      .on('error', (err) => {
        resolve(false);
      })
      .end();
  });
}

export function whois(domain: string, host = 'whois.denic.de'): Promise<string> {
  const socket = new net.Socket();
  const msg = domain + '\r\n';

  return new Promise((resolve, reject) => {
    socket.connect(43, host, () => {
      socket.write(msg);
    });

    socket.on('data', (data) => {
      resolve(data.toString());
      socket.destroy();
    });

    socket.on('error', (err) => {
      reject(err);
    });
  });
}
