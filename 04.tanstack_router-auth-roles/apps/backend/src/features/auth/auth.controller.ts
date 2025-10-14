import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { validator as zValidator } from 'hono-openapi';
import {
  COOKIE_AUTH_EXPIRATION,
  COOKIE_AUTH_NAME,
  COOKIE_REFRESH_EXPIRATION,
  COOKIE_REFRESH_NAME,
} from '../../config/cookies.constant.js';
import { createLoggerFactory } from '../../factories/logger.factories.js';
import { HTTPException400BadRequest } from '../../utils/apiError.util.js';
import { secondsUntil, signAuthCookie, signRefreshCookie } from '../../utils/jsonwebtoken.util.js';
import { getUserIfPasswordMatch } from '../users/users.service.js';
import { postLoginRoute, postLogoutRoute } from './auth.route.js';
import { AuthSchema } from './auth.schema.js';
import { createSession, deleteSession } from './auth.service.js';

const app = createLoggerFactory
  .createApp()
  .post('/login', postLoginRoute, zValidator('json', AuthSchema), async (c) => {
    const { email, password } = await c.req.valid('json');

    const logger = c.get('logger');

    logger.info({ email }, 'Logging in user from controller');

    const user = await getUserIfPasswordMatch(email, password);

    if (!user) {
      throw HTTPException400BadRequest('Invalid email or password', { res: c.res });
    }

    logger.info({ email }, 'User logged in successfully');

    const authTokenDate = new Date(Date.now() + Number.parseInt(COOKIE_AUTH_EXPIRATION, 10) * 1000);

    const refreshTokenDate = new Date(Date.now() + Number.parseInt(COOKIE_REFRESH_EXPIRATION, 10) * 1000);

    const refreshToken = signRefreshCookie(user.id, secondsUntil(refreshTokenDate));
    const authToken = signAuthCookie(user.id, secondsUntil(authTokenDate));

    setCookie(c, COOKIE_AUTH_NAME, authToken, {
      path: '/',
      secure: true,
      expires: authTokenDate,
      sameSite: 'Strict',
    });

    setCookie(c, COOKIE_REFRESH_NAME, refreshToken, {
      path: '/',
      secure: true,
      httpOnly: true,
      expires: refreshTokenDate,
      sameSite: 'Strict',
    });

    createSession(user.id, refreshToken);

    return c.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  })

  .post('/logout', postLogoutRoute, async (c) => {
    const logger = c.get('logger');

    logger.info('Logging out user from controller');
    const refreshToken = getCookie(c, COOKIE_REFRESH_NAME);

    if (refreshToken) {
      deleteSession(refreshToken);
    }

    deleteCookie(c, COOKIE_AUTH_NAME);
    deleteCookie(c, COOKIE_REFRESH_NAME);

    return c.json({ message: 'Logged out' });
  });

export default app;
