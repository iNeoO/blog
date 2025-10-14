import { useRouter } from '@tanstack/react-router';
import type { AppType } from 'backend/hc';
import { hc } from 'hono/client';
import { useEffect } from 'react';
import { useAuth } from '../context/auth.context';

export async function toError(res: Response) {
  let msg = `${res.status} ${res.statusText}`;

  try {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = await res.json();

      if (Array.isArray(body?.error) && body.error.length > 0) {
        const messages = body.error.map((e: { message?: string }) => e?.message).filter(Boolean);
        if (messages.length > 0) {
          msg = messages.join(', ');
        }
      } else if (typeof body?.message === 'string' && body.message.length > 0) {
        msg = body.message;
      }
    } else {
      const text = await res.text();
      if (text) msg = text;
    }
  } catch {}

  const err = new Error(msg) as Error & { status: number; response: Response };
  err.status = res.status;
  err.response = res;
  throw err;
}

export function useRpcClient() {
  const { disconnect, refreshProfile, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null || user) {
      router.invalidate();
    }
  }, [user, router.invalidate]);

  const request: typeof fetch = async (input, init) => {
    const res = await fetch(input, init);
    if (res.ok) return res;
    if (res.status === 401) {
      disconnect();
    }
    if (res.status === 403) {
      await refreshProfile();
    }
    const error = await toError(res);
    throw error;
  };

  return hc<AppType>('/api', { fetch: request });
}
