import { client } from './hc.ts';

export async function getUsers() {
  const res = await client.users.$get();
  const data = await res.json();
  return data;
}

type PostUserParams = { email: string; password: string };

export async function postUser({ email, password }: PostUserParams) {
  const res = await client.users.$post({
    json: { email, password },
  });
  const data = await res.json();
  return data;
}
