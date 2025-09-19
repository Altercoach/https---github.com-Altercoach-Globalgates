
"use client";

import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, AuthRole } from '@/lib/types';
import { LS_KEYS } from '@/lib/constants';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, role: AuthRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [auth, setAuth] = useState<AuthState>(() => {
    if (typeof window === 'undefined') return { loggedIn: false, user: null };
    try {
      const raw = localStorage.getItem(LS_KEYS.AUTH);
      const parsed = raw ? JSON.parse(raw) : { loggedIn: false, user: null };
      // Basic validation
      if (parsed.user && parsed.user.role) {
        return parsed;
      }
      return { loggedIn: false, user: null };
    } catch {
      return { loggedIn: false, user: null };
    }
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if(isMounted){
      localStorage.setItem(LS_KEYS.AUTH, JSON.stringify(auth));
    }
  }, [auth, isMounted]);

  const login = (email: string, role: AuthRole) => {
    setAuth({ loggedIn: true, user: { email, role } });
    if (role === 'admin') {
      router.push('/myoffice');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    setAuth({ loggedIn: false, user: null });
    router.push('/login');
  };

  const value = useMemo(() => ({ auth, login, logout }), [auth]);

  if (!isMounted) {
    return null;
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
