import { describe, it, expect } from 'vitest';
import net from 'net';
import { findFreePort } from './find-free-port';

describe('find-free-port', () => {
  it('returns the same port if it is free', async () => {
    // Use a high port unlikely to be in use
    const port = await findFreePort(59001);
    expect(port).toBe(59001);
  });

  it('finds next free port when the start port is busy', async () => {
    // Create a server on a specific port
    const server = net.createServer();
    await new Promise<void>((resolve) => {
      server.listen(59010, '127.0.0.1', resolve);
    });

    try {
      const port = await findFreePort(59010, 5);
      expect(port).toBeGreaterThan(59010);
      expect(port).toBeLessThanOrEqual(59015);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('handles maxAttempts gracefully', async () => {
    const port = await findFreePort(59020, 2);
    expect(port).toBeGreaterThanOrEqual(59020);
    expect(port).toBeLessThanOrEqual(59022);
  });
});
