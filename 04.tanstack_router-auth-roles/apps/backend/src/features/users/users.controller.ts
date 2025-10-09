import { HTTPException } from 'hono/http-exception';
import { validator as zValidator } from 'hono-openapi';
import { createLoggerFactory } from '../../factories/logger.factories.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { getUserRoute, getUsersRoute, patchUserRoute, postUserRoute } from './users.route.js';
import { UserCreationSchema, UserUpdateSchema } from './users.schema.js';
import { createUser, getUser, getUsers, patchUser } from './users.service.js';

const app = createLoggerFactory
  .createApp()
  .use(authMiddleware)
  .post('/', postUserRoute, zValidator('json', UserCreationSchema), async (c) => {
    const { email, password } = await c.req.valid('json');

    const newUser = await createUser(email, password);

    const logger = c.get('logger');

    logger.info({ user: newUser }, 'Creating new user from controller');

    return c.json(newUser, 201);
  })
  .use(authMiddleware)
  .get('/:id', getUserRoute, (c) => {
    const id = c.req.param('id');

    const user = getUser(id);

    if (!user) {
      throw new HTTPException(404, { message: 'User not found', res: c.res });
    }

    return c.json(user);
  })
  .get('/', getUsersRoute, (c) => {
    const users = getUsers();
    return c.json(users);
  })
  .patch('/:id', patchUserRoute, zValidator('json', UserUpdateSchema), async (c) => {
    const id = c.req.param('id');
    const { email, password, role } = await c.req.valid('json');

    const updatedUser = await patchUser(id, { email, password, role });

    if (!updatedUser) {
      throw new HTTPException(404, { message: 'User not found', res: c.res });
    }

    return c.json(updatedUser);
  });

export default app;
