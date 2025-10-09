import { client } from '../lib/hc.ts';

export type PostLoginParams = {
  email: string;
  password: string;
};

export async function postLogin({ email, password }: PostLoginParams) {
  const res = await client.auth.login.$post({ json: { email, password } });
  const data = await res.json();
  return data;
}

export async function postLogout() {
  const res = await client.auth.logout.$post();
  const data = await res.json();
  return data;
}
