'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { saveAuth, clearAuth, getUser, isAuthenticated } from '@/lib/auth';
import type { PatientAuthResponse } from '@/lib/types';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<PatientAuthResponse['patient'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    saveAuth(data);
    setUser(data.patient);
    return data;
  };

  const signup = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const data = await api.signup(formData);
    saveAuth(data);
    setUser(data.patient);
    return data;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    router.push('/');
  };

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    login,
    signup,
    logout,
  };
}
