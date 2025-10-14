import { describeRoute, resolver } from 'hono-openapi';
import { ZodSafeParseErrorSchema } from '../../utils/error.schema.js';
import { AuthSchema, LogoutSchema } from './auth.schema.js';

export const postLoginRoute = describeRoute({
  summary: 'Login a user',
  tags: ['Auth'],
  responses: {
    200: {
      description: 'User logged in successfully',
      content: {
        'application/json': {
          schema: resolver(AuthSchema),
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
      content: {
        'application/json': {
          schema: resolver(LogoutSchema),
        },
      },
    },
  },
});
