import { useMutation, useQuery } from '@tanstack/react-query';
import { useRpcClient } from './useRpcClient.ts';

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

export const usePostUser = () => {
  const client = useRpcClient();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await client.users.$post({
        json: data,
      });
      const result = await res.json();
      return result;
    },
  });
};
