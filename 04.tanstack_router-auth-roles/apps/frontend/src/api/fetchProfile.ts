import { client } from './hc.ts';

export async function getProfile() {
  const res = await client.profile.me.$get();
  const data = await res.json();
  return data;
}
