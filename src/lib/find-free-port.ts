/* eslint-disable no-console */
import net from 'net';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

/**
 * Find a free port starting from the given port number.
 * If the given port is free, returns it. Otherwise increments by 1 until a free port is found.
 */
export async function findFreePort(startPort: number, maxAttempts = 20): Promise<number> {
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    const isFree = await isPortFree(port);
    if (isFree) return port;
  }
  // If all attempts exhausted, return the original port (let the server fail naturally)
  return startPort;
}

function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, '127.0.0.1', () => {
      server.close();
      resolve(true);
    });
    server.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Run as CLI: node find-free-port.js [port]
 * Outputs the free port number to stdout.
 */
if (typeof process !== 'undefined' && process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const startPort = parseInt(process.argv[2] || '3000', 10);
  findFreePort(startPort).then((port) => {
    console.log(port);
    if (port !== startPort) {
      console.error(`Port ${startPort} is busy, using ${port}`);
    }
  });
}
