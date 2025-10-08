import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { getProfile } from '../api/fetchProfile';
import { useRpcClient } from './useRpcClient.ts';

export type User = Awaited<ReturnType<typeof getProfile>>;

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
