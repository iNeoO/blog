import { describeRoute, resolver } from 'hono-openapi';
import { ZodSafeParseErrorSchema } from '../../utils/error.schema.js';
import { ErrorSchema, UserSchema, UsersSchema } from './users.schema.js';

export const getUserRoute = describeRoute({
  summary: 'Retrieve a user by ID',
  tags: ['Users'],
  responses: {
    200: {
      description: 'Retrieve user by ID',
      content: {
        'application/json': {
          schema: resolver(UserSchema),
        },
      },
    },
    400: {
      description: 'Error',
      content: {
        'application/json': {
          schema: resolver(ErrorSchema),
        },
      },
    },
  },
});

export const getUsersRoute = describeRoute({
  summary: 'Retrieve all users',
  tags: ['Users'],
  responses: {
    200: {
      description: 'Retrieve users',
      content: {
        'application/json': {
          schema: resolver(UsersSchema),
        },
      },
    },
  },
});

export const postUserRoute = describeRoute({
  summary: 'Create a new user',
  tags: ['Users'],
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: resolver(UserSchema),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: resolver(ZodSafeParseErrorSchema),
        },
      },
    },
  },
});
