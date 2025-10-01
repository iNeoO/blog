import jwt from 'jsonwebtoken';
import { JWT_AUTH_SECRET, JWT_REFRESH_SECRET } from '../config/jwt.constant.js';

declare module 'jsonwebtoken' {
  export interface IDJwtPayload extends jwt.JwtPayload {
    id: string;
  }
}

type Verify = [null, jwt.IDJwtPayload] | [jwt.TokenExpiredError | jwt.JsonWebTokenError | jwt.NotBeforeError, null];

export const verify = (token: string, secret: string): Verify => {
  try {
    return [null, <jwt.IDJwtPayload>jwt.verify(token, secret)];
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return [error, null];
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return [error, null];
    }
    if (error instanceof jwt.NotBeforeError) {
      return [error, null];
    }
    throw error;
  }
};

export const signAuthCookie = (userId: string, date: Date) =>
  jwt.sign({ id: userId }, JWT_AUTH_SECRET, {
    expiresIn: date.getTime() - Date.now(),
  });

export const signRefreshCookie = (userId: string, date: Date) =>
  jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: date.getTime() - Date.now(),
  });
