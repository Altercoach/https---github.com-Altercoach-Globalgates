
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

const initialAuthState: AuthState = { loggedIn: false, user: null };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>(initialAuthState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEYS.AUTH);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Basic validation
        if (parsed.user && parsed.user.role) {
          setAuth(parsed);
        }
      }
    } catch {
      // Ignore parsing errors
    }
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
