import { ROLE } from 'common/constants';
import { getLoggerStore } from '../../utils/asyncLocalStorage.js';
import { compareHash } from '../../utils/crypt.util.js';
import type { User } from './user.type.js';

const users: User[] = [];

export const getUser = (id: string) => users.find((user) => user.id === id);

export const getUserByEmail = (email: string) => users.find((user) => user.email === email);

export const getUserIfPasswordMatch = async (email: string, password: string) => {
  const user = users.find((user) => user.email === email);

  if (!user) {
    return null;
  }

  const result = await compareHash(password, user.password);

  if (!result) {
    return null;
  }

  return user;
};

export const getUsers = () => users;

export const createUser = (email: string, password: string) => {
  const newUser = {
    id: (users.length + 1).toString(),
    email,
    password,
    role: ROLE.USER,
  };

  const logger = getLoggerStore();

  logger.info({ user: newUser }, 'Creating new user from service');

  users.push(newUser);
  return newUser;
};
