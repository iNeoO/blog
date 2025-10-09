import { useMutation } from '@tanstack/react-query';
import { type PostLoginParams, postLogin, postLogout } from '../api/fetchLogin';

export const useLogin = () =>
  useMutation({
    mutationFn: (json: PostLoginParams) => postLogin(json),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: () => postLogout(),
  });
