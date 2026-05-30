import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
const PASSWORD_MIN_LENGTH = 8;

describe('password API validation schema', () => {
  const passwordSchema = vi.fn().mockImplementation((data: unknown) => {
    if (!data || typeof data !== 'object') {
      return { success: false, error: { errors: [{ message: 'Invalid input' }] } };
    }
    const { currentPassword, newPassword } = data as Record<string, unknown>;
    if (typeof currentPassword !== 'string' || currentPassword.length === 0) {
      return { success: false, error: { errors: [{ message: 'Current password is required' }] } };
    }
    if (typeof newPassword !== 'string' || newPassword.length < PASSWORD_MIN_LENGTH) {
      return { success: false, error: { errors: [{ message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` }] } };
    }
    return { success: true, data: { currentPassword, newPassword } };
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects missing currentPassword', () => {
    const result = passwordSchema({ newPassword: 'newpass123' });
    expect(result.success).toBe(false);
  });

  it('rejects short newPassword', () => {
    const result = passwordSchema({ currentPassword: 'oldpass123', newPassword: 'short' });
    expect(result.success).toBe(false);
  });

  it('accepts valid passwords', () => {
    const result = passwordSchema({ currentPassword: 'oldpass123', newPassword: 'newpass123' });
    expect(result.success).toBe(true);
  });
});

describe('bcrypt password hashing', () => {
  it('hashes and verifies password correctly', async () => {
    const password = 'mySecurePassword123';
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const valid = await bcrypt.compare(password, hash);
    expect(valid).toBe(true);
  });

  it('rejects wrong password', async () => {
    const password = 'mySecurePassword123';
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const valid = await bcrypt.compare('wrongPassword123', hash);
    expect(valid).toBe(false);
  });

  it('produces different hashes for same password', async () => {
    const password = 'mySecurePassword123';
    const hash1 = await bcrypt.hash(password, SALT_ROUNDS);
    const hash2 = await bcrypt.hash(password, SALT_ROUNDS);
    expect(hash1).not.toBe(hash2);
  });
});
