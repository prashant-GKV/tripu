/**
 * Thin fetch wrapper for the Tripu API. Attaches the auth token (or, in dev, an
 * `x-dev-user` header) and unwraps JSON. Base URL comes from VITE_API_URL.
 */
const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000';
const DEV_USER = import.meta.env.VITE_DEV_USER as string | undefined;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('tripu_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  else if (DEV_USER) headers['x-dev-user'] = DEV_USER;
  return headers;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
    credentials: 'include',
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.error ?? body.message ?? message;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiBaseUrl = BASE;
