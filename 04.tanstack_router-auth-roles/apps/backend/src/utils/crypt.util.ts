import * as argon2 from "argon2";

export const hashPassword = async (password: string) =>
  await argon2.hash(password);

export const compareHash = async (password: string, hash: string) =>
  await argon2.verify(hash, password);
