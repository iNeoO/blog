import type { Session } from './auth.type.js';

const sessions: Session[] = [];

export const createSession = (userId: string, refreshToken: string) => {
  const session = {
    userId,
    refreshToken,
    createdAt: new Date(),
  };
  sessions.push(session);
  return session;
};

export const getSession = (refreshToken: string) => {
  return sessions.find((session) => session.refreshToken === refreshToken);
};

export const deleteSession = (refreshToken: string) => {
  const index = sessions.findIndex((session) => session.refreshToken === refreshToken);
  if (index !== -1) {
    sessions.splice(index, 1);
    return true;
  }
  return false;
};
