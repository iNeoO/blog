import { useRouter } from '@tanstack/react-router';
import type { AppType } from 'backend/hc';
import { hc } from 'hono/client';
import { useAuth } from '../context/auth.context';

export function useRpcClient() {
  const { disconnect } = useAuth();
  const router = useRouter();

  const request: typeof fetch = async (input, init) => {
    const res = await fetch(input, init);
    if (res.status === 401) {
      disconnect();
      router.invalidate();
      throw res;
    }
    if (!res.ok) throw res;
    return res;
  };

  return hc<AppType>('/api', { fetch: request });
}
