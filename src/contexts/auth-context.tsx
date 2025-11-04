
"use client";

import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, AuthRole, User } from '@/lib/types';
import { LS_KEYS } from '@/lib/constants';

interface AuthContextType {
  auth: {
      isMounted: boolean;
      loggedIn: boolean;
      user: User | null;
  };
  login: (email: string, role: AuthRole) => void;
  logout: () => void;
}

const initialAuthState: AuthContextType['auth'] = { isMounted: false, loggedIn: false, user: null };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [auth, setAuth] = useState(initialAuthState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEYS.AUTH);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.user && parsed.user.role) {
          setAuth({ ...parsed, isMounted: true });
        } else {
           setAuth({ ...initialAuthState, isMounted: true });
        }
      } else {
        setAuth({ ...initialAuthState, isMounted: true });
      }
    } catch {
      setAuth({ ...initialAuthState, isMounted: true });
    }
  }, []);

  useEffect(() => {
    if(auth.isMounted){
      localStorage.setItem(LS_KEYS.AUTH, JSON.stringify({ loggedIn: auth.loggedIn, user: auth.user }));
    }
  }, [auth]);

  const login = (email: string, role: AuthRole) => {
    const newState = { isMounted: true, loggedIn: true, user: { email, role } };
    setAuth(newState);
    if (role === 'admin') {
      router.push('/myoffice');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    setAuth({ isMounted: true, loggedIn: false, user: null });
    router.push('/login');
  };

  const value = useMemo(() => ({ auth, login, logout }), [auth]);

  // Prevent flash of unauthenticated content by returning null until mounted
  if (!auth.isMounted) {
    return null;
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
    