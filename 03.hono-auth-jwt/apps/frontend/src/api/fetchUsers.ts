import { client } from "./hc.ts";

export async function fetchUsers() {
  const res = await client.users.$get();
  const data = await res.json();
  return data;
}
