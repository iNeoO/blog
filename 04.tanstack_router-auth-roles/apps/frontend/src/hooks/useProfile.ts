import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { InferResponseType } from 'hono/client';
import type { client as RootClient } from '../lib/hc.ts';
import { useRpcClient } from './useRpcClient.ts';

export type User = InferResponseType<typeof RootClient.profile.me.$get, 200>;

export function useProfile(options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) {
  const client = useRpcClient();
  return useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await client.profile.me.$get();
      const data = await res.json();
      return data;
    },
    retry: false,
    ...options,
  });
}
