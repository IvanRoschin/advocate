import { describe, expect, it, vi } from 'vitest';

const { getServerSession } = vi.hoisted(() => ({
  getServerSession: vi.fn(),
}));

vi.mock('next-auth', () => ({ getServerSession }));
vi.mock('@/app/config/authOptions', () => ({ authOptions: {} }));

import { requireAdmin } from './requireAdmin';

describe('requireAdmin', () => {
  it('throws UnauthorizedError when there is no session', async () => {
    getServerSession.mockResolvedValueOnce(null);

    await expect(requireAdmin()).rejects.toThrow(
      'Потрібні права адміністратора'
    );
  });

  it('throws UnauthorizedError for a non-admin role (e.g. client)', async () => {
    getServerSession.mockResolvedValueOnce({ user: { role: 'client' } });

    await expect(requireAdmin()).rejects.toThrow(
      'Потрібні права адміністратора'
    );
  });

  it('resolves for an admin session', async () => {
    const session = { user: { role: 'admin' } };
    getServerSession.mockResolvedValueOnce(session);

    await expect(requireAdmin()).resolves.toBe(session);
  });

  it('resolves for a manager session', async () => {
    const session = { user: { role: 'manager' } };
    getServerSession.mockResolvedValueOnce(session);

    await expect(requireAdmin()).resolves.toBe(session);
  });
});
