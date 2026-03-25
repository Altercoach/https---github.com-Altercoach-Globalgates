
"use client";

import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, AuthRole, User } from '@/lib/types';
import { LS_KEYS, initialCustomers } from '@/lib/constants';

interface AuthContextType {
  auth: {
      isMounted: boolean;
      loggedIn: boolean;
      user: User | null;
  };
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string) => Promise<void>;
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

  const login = async (email: string, password?: string) => {
    // Demo credentials
    const isValidDemo = 
      (email === 'admin@negocio.com' || email === 'demo@cliente.com') &&
      (!password || password === 'Demo123!');

    if (!isValidDemo && email && !password) {
      // Fallback for demo without password
      console.log('🎯 Demo login allowed');
    } else if (!isValidDemo) {
      throw new Error('Invalid credentials. Use demo@cliente.com or admin@negocio.com with password Demo123!');
    }

    const customerData = initialCustomers.find(c => c.email === email);
    const plan = customerData ? customerData.plan : 'Free';
    const role: AuthRole = email === 'admin@negocio.com' ? 'admin' : 'customer';

    const newState = { isMounted: true, loggedIn: true, user: { email, role, plan } };
    setAuth(newState);

    if (role === 'admin') {
      router.push('/myoffice');
    } else {
      router.push('/dashboard');
    }
  };

  const signup = async (email: string, password?: string) => {
    // Allow signup with demo emails for testing
    const isAllowed = email && (email.includes('@') || email === 'admin@negocio.com' || email === 'demo@cliente.com');
    
    if (!isAllowed) {
      throw new Error('Please enter a valid email address');
    }

    const role: AuthRole = email === 'admin@negocio.com' ? 'admin' : 'customer';
    const plan = 'Starter';

    const newState = { isMounted: true, loggedIn: true, user: { email, role, plan } };
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

  const value = useMemo(() => ({ auth, login, signup, logout }), [auth]);

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
    