import { ROLE, type RoleValue } from 'common/constants';
import { getLoggerStore } from '../../utils/asyncLocalStorage.js';
import { compareHash, hashPassword } from '../../utils/crypt.util.js';
import type { User } from './user.type.js';

const users: User[] = [];

export const getUser = (id: string) => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    return null;
  }
  return { id: user.id, email: user.email, role: user.role };
};

export const getUserIfPasswordMatch = async (email: string, password: string) => {
  const user = users.find((user) => user.email === email);

  if (!user) {
    return null;
  }

  const result = await compareHash(password, user.password);

  if (!result) {
    return null;
  }

  return { id: user.id, email: user.email, role: user.role };
};

export const getUsers = () => users.map((user) => ({ id: user.id, email: user.email, role: user.role }));

export const createUser = async (email: string, password: string) => {
  const hash = await hashPassword(password);

  const role = users.length === 0 ? ROLE.ADMIN : ROLE.USER;

  const newUser = {
    id: (users.length + 1).toString(),
    email,
    password: hash,
    role,
  };

  const logger = getLoggerStore();

  logger.info({ user: newUser }, 'Creating new user from service');

  users.push(newUser);
  return {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };
};

export const patchUser = async (
  id: string,
  { password, email, role }: { password?: string; email?: string; role?: RoleValue },
) => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    return null;
  }
  if (password) {
    const hash = await hashPassword(password);
    user.password = hash;
  }
  if (email) {
    user.email = email;
  }
  if (role) {
    user.role = role;
  }
  return { id: user.id, email: user.email, role: user.role };
};
