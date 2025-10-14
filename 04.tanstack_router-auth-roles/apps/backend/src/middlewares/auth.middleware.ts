import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { COOKIE_AUTH_EXPIRATION, COOKIE_AUTH_NAME, COOKIE_REFRESH_NAME } from '../config/cookies.constant.js';
import { JWT_AUTH_SECRET, JWT_REFRESH_SECRET } from '../config/jwt.constant.js';
import { createAuthFactory } from '../factories/auth.factories.js';
import { getSession } from '../features/auth/auth.service.js';
import { getUser } from '../features/users/users.service.js';
import { HTTPException401Unauthorized } from '../utils/apiError.util.js';
import { getJwtExpirationDate, secondsUntil, signAuthCookie, verifyJwt } from '../utils/jsonwebtoken.util.js';

export const authMiddleware = createAuthFactory.createMiddleware(async (c, next) => {
  const logger = c.get('logger');
  const authToken = getCookie(c, COOKIE_AUTH_NAME);

  if (authToken) {
    try {
      const [err, decoded] = verifyJwt(authToken, JWT_AUTH_SECRET);
      if (err) {
        logger.info({ err }, 'Auth token verification failed');
        deleteCookie(c, COOKIE_AUTH_NAME);
      } else {
        c.set('userId', decoded.userId);
        logger.info({ userId: decoded.userId }, 'User authenticated');
        return await next();
      }
    } catch (err) {
      logger.error({ err }, 'Unexpected error in auth middleware');
      deleteCookie(c, COOKIE_AUTH_NAME);
    }
  }

  const refreshToken = getCookie(c, COOKIE_REFRESH_NAME);
  if (!refreshToken) {
    throw HTTPException401Unauthorized('Unauthorized', { res: c.res });
  }

  const session = getSession(refreshToken);
  if (!session) {
    deleteCookie(c, COOKIE_REFRESH_NAME);
    throw HTTPException401Unauthorized('Unauthorized', { res: c.res });
  }

  try {
    const [err, decoded] = verifyJwt(session.refreshToken, JWT_REFRESH_SECRET);
    if (err) {
      logger.info({ err }, 'Refresh token verification failed');
      deleteCookie(c, COOKIE_REFRESH_NAME);
    } else {
      const user = getUser(decoded.userId);
      if (user) {
        logger.info({ userId: decoded.userId }, 'User authenticated');
        const expAt = getJwtExpirationDate(COOKIE_AUTH_EXPIRATION);
        const newAuthToken = signAuthCookie(user.id, secondsUntil(expAt));
        setCookie(c, COOKIE_AUTH_NAME, newAuthToken, {
          path: '/',
          secure: true,
          expires: expAt,
          sameSite: 'Strict',
        });
        c.set('userId', decoded.userId);
        return await next();
      } else {
        logger.info({ userId: decoded.userId }, 'User not found for refresh token');
        deleteCookie(c, COOKIE_REFRESH_NAME);
      }
    }
  } catch (err) {
    logger.error({ err }, 'Unexpected error in refresh token verification');
    deleteCookie(c, COOKIE_REFRESH_NAME);
  }

  throw HTTPException401Unauthorized('Unauthorized', { res: c.res });
});
