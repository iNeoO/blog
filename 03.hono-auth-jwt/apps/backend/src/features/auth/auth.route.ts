import { describeRoute, resolver } from 'hono-openapi';
import { ErrorSchema, ZodSafeParseErrorSchema } from '../../utils/error.schema.js';
import { UserSchema } from '../users/users.schema.js';

export const postLoginRoute = describeRoute({
  summary: 'Login a user',
  tags: ['Auth'],
  responses: {
    200: {
      description: 'User logged in successfully',
      content: {
        'application/json': {
          schema: resolver(UserSchema),
        },
      },
    },
    400: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: resolver(ZodSafeParseErrorSchema),
        },
      },
    },
  },
});

export const postLogoutRoute = describeRoute({
  summary: 'Logout a user',
  tags: ['Auth'],
  responses: {
    200: {
      description: 'User logged out successfully',
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
