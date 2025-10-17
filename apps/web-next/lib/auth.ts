'use client';

import { PatientAuthResponse } from './types';

export const AUTH_TOKEN_KEY = 'authToken';
export const USER_KEY = 'user';

export function saveAuth(data: PatientAuthResponse) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.patient));
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getUser(): PatientAuthResponse['patient'] | null {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
