import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import type { AuthRole } from '@/lib/types';

export function useRole(): AuthRole | null {
  const ctx = useContext(AuthContext);
  if (!ctx || !ctx.auth.user) return null;
  return ctx.auth.user.role;
}

export function useIsAdmin(): boolean {
  const role = useRole();
  return role === 'admin';
}

export function useIsCustomer(): boolean {
  const role = useRole();
  return role === 'customer';
}
