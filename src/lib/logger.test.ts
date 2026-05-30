import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from './logger';

/* eslint-disable no-console */

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs error messages via console.error', () => {
    logger.error('Test error', { code: 500 });
    expect(console.error).toHaveBeenCalled();
    const call = vi.mocked(console.error).mock.calls[0]?.[0] ?? '';
    expect(call).toContain('[ERROR]');
    expect(call).toContain('Test error');
    expect(call).toContain('500');
  });

  it('logs warn messages via console.warn', () => {
    logger.warn('Test warning');
    expect(console.warn).toHaveBeenCalled();
    const call = vi.mocked(console.warn).mock.calls[0]?.[0] ?? '';
    expect(call).toContain('[WARN]');
    expect(call).toContain('Test warning');
  });

  it('logs info messages via console.log', () => {
    logger.info('Test info');
    expect(console.log).toHaveBeenCalled();
    const call = vi.mocked(console.log).mock.calls[0]?.[0] ?? '';
    expect(call).toContain('[INFO]');
    expect(call).toContain('Test info');
  });

  it('includes ISO timestamp in log output', () => {
    logger.info('Timestamp test');
    const call = vi.mocked(console.log).mock.calls[0]?.[0] ?? '';
    expect(call).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('omits context JSON when not provided', () => {
    logger.error('No context');
    const call = vi.mocked(console.error).mock.calls[0]?.[0] ?? '';
    expect(call).not.toMatch(/\{.*\}/);
  });
});
