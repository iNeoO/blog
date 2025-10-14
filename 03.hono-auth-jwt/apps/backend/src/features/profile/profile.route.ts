import { describeRoute, resolver } from 'hono-openapi';
import { ErrorSchema } from '../../utils/error.schema.js';
import { UserWithoutPasswordSchema } from '../users/users.schema.js';

export const getProfileRoute = describeRoute({
  tags: ['Profile'],
  responses: {
    200: {
      description: 'Retrieve users',
      content: {
        'application/json': {
          schema: resolver(UserWithoutPasswordSchema),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: resolver(ErrorSchema),
        },
      },
    },
  },
});
