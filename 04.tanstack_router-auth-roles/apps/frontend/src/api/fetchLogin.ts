import { toError } from '../hooks/useRpcClient';
import { client } from '../lib/hc.ts';

export type PostLoginParams = {
  email: string;
  password: string;
};

export async function postLogin({ email, password }: PostLoginParams) {
  const res = await client.auth.login.$post({ json: { email, password } });
  if (res.ok) return await res.json();
  const error = await toError(res);
  throw error;
}

export async function postLogout() {
  const res = await client.auth.logout.$post();
  const data = await res.json();
  return data;
}
