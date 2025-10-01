import * as argon2 from 'argon2';

export const hashPassword = (password: string) => {
  return argon2.hash(password);
};

export const compareHash = (password: string, hash: string) => argon2.verify(hash, password);
