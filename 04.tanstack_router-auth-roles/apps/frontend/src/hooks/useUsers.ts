import { useMutation, useQuery } from '@tanstack/react-query';
import type { RoleValue } from 'common/constants';
import { useRpcClient } from './useRpcClient.ts';

type PostUserParams = { email: string; password: string };
type PatchUserParams = { id: string } & Partial<PostUserParams & { role: RoleValue }>;

export const useUsers = () => {
  const client = useRpcClient();
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await client.users.$get();
      const data = await res.json();
      return data;
    },
  });
};

export const useUser = (id: string) => {
  const client = useRpcClient();
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await client.users[':id'].$get({ param: { id } });
      const data = await res.json();
      return data;
    },
    enabled: !!id,
  });
};

export const usePostUser = (options?: Parameters<typeof useMutation>[0]) => {
  const client = useRpcClient();
  return useMutation({
    mutationFn: async (data: PostUserParams) => {
      const res = await client.users.$post({
        json: data,
      });
      const result = await res.json();
      return result;
    },
    ...options,
  });
};

export const usePatchUser = () => {
  const client = useRpcClient();
  return useMutation({
    mutationFn: async (data: PatchUserParams) => {
      const res = await client.users[':id'].$patch({
        param: { id: data.id },
        json: {
          email: data.email,
          password: data.password,
          role: data.role,
        },
      });
      const result = await res.json();
      return result;
    },
  });
};
