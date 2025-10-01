import { setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { validator as zValidator } from 'hono-openapi';
import {
  COOKIE_AUTH_EXPIRATION,
  COOKIE_AUTH_NAME,
  COOKIE_REFRESH_EXPIRATION,
  COOKIE_REFRESH_NAME,
} from '../../config/cookies.constant.js';
import { createLoggerFactory } from '../../factories/logger.factories.js';
import { signAuthCookie, signRefreshCookie } from '../../utils/jsonwebtoken.util.js';
import { getUserIfPasswordMatch } from '../users/users.service.js';
import { postLoginRoute } from './auth.route.js';
import { AuthSchema } from './auth.schema.js';

const app = createLoggerFactory
  .createApp()
  .post('/login', postLoginRoute, zValidator('json', AuthSchema), async (c) => {
    const { email, password } = await c.req.valid('json');

    const logger = c.get('logger');

    logger.info({ email }, 'Logging in user from controller');

    const user = await getUserIfPasswordMatch(email, password);

    if (!user) {
      throw new HTTPException(401, { message: 'Invalid email or password' });
    }

    logger.info({ email }, 'User logged in successfully');

    const authTokenDate = new Date(Date.now() + Number.parseInt(COOKIE_AUTH_EXPIRATION, 10) * 1000);

    const refreshTokenDate = new Date(Date.now() + Number.parseInt(COOKIE_REFRESH_EXPIRATION, 10) * 1000);

    const refreshToken = signRefreshCookie(user.id, refreshTokenDate);
    const authToken = signAuthCookie(user.id, authTokenDate);

    setCookie(c, COOKIE_AUTH_NAME, authToken, {
      path: '/',
      secure: true,
      httpOnly: true,
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

    return c.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  });

export default app;
