import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/hooks/use-role';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'admin' | 'customer';
  redirectTo?: string;
}

export function RouteGuard({ children, requireAuth = true, requireRole, redirectTo = '/login' }: RouteGuardProps) {
  const { auth } = useAuth();
  const role = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isMounted) return;
    if (requireAuth && !auth.loggedIn) {
      router.replace(redirectTo);
    } else if (requireRole && role !== requireRole) {
      router.replace('/');
    }
  }, [auth, role, requireAuth, requireRole, router, redirectTo]);

  if (requireAuth && !auth.loggedIn) return null;
  if (requireRole && role !== requireRole) return null;
  return <>{children}</>;
}
