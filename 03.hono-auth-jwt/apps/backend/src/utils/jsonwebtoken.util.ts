import jwt from 'jsonwebtoken';
import { JWT_AUTH_SECRET, JWT_REFRESH_SECRET } from '../config/jwt.constant.js';

declare module 'jsonwebtoken' {
  export interface IDJwtPayload extends jwt.JwtPayload {
    userId: string;
  }
}

type Verify = [null, jwt.IDJwtPayload] | [jwt.TokenExpiredError | jwt.JsonWebTokenError | jwt.NotBeforeError, null];

export const verifyJwt = (token: string, secret: string): Verify => {
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

export const signAuthCookie = (userId: string, ttlSec: number) =>
  jwt.sign(
    {
      userId,
    },
    JWT_AUTH_SECRET,
    {
      expiresIn: ttlSec,
    },
  );

export const signRefreshCookie = (userId: string, ttlSec: number) =>
  jwt.sign(
    {
      userId,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: ttlSec,
    },
  );

export const secondsUntil = (date: Date) => Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000));

export const getJwtExpirationDate = (timestamp: string) => new Date(Date.now() + Number.parseInt(timestamp, 10) * 1000);
