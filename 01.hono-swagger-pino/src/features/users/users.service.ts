import { getLoggerStore } from '../../utils/asyncLocalStorage.js';

const users = [
  { id: '1', name: 'John Doe', age: 30 },
  { id: '2', name: 'Jane Smith', age: 25 },
];

export const getUser = (id: string) => users.find((user) => user.id === id);

export const getUsers = () => users;

export const createUser = (name: string, age: number) => {
  const newUser = { id: (users.length + 1).toString(), name, age };

  const logger = getLoggerStore();

  logger.info({ user: newUser }, 'Creating new user from service');

  users.push(newUser);
  return newUser;
};
