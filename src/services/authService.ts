import { api, setToken, clearToken } from './apiClient';
import type { User } from '../types';

interface AuthResponse { token: string; user: User; }

export async function register(data: { username: string; email: string; password: string }): Promise<User> {
  const res = await api<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  setToken(res.token);
  return res.user;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await api<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  setToken(res.token);
  return res.user;
}

export function logout(): void {
  clearToken();
}

export async function getCurrentUser(): Promise<User> {
  try {
    return await api<User>('/auth/me');
  } catch (e) {
    clearToken();
    throw e;
  }
}
