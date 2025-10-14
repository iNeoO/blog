import { describeRoute, resolver } from 'hono-openapi';
import { ErrorSchema, ZodSafeParseErrorSchema } from '../../utils/error.schema.js';
import { UsersWithoutPasswordSchema, UserWithoutPasswordSchema } from './users.schema.js';

export const getUserRoute = describeRoute({
  tags: ['Users'],
  responses: {
    200: {
      description: 'Retrieve user by ID',
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
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: resolver(ErrorSchema),
        },
      },
    },
  },
});

export const getUsersRoute = describeRoute({
  tags: ['Users'],
  responses: {
    200: {
      description: 'Retrieve users',
      content: {
        'application/json': {
          schema: resolver(UsersWithoutPasswordSchema),
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
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: resolver(ErrorSchema),
        },
      },
    },
  },
});

export const postUserRoute = describeRoute({
  tags: ['Users'],
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: resolver(UserWithoutPasswordSchema),
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

export const patchUserRoute = describeRoute({
  tags: ['Users'],
  responses: {
    200: {
      description: 'User updated successfully',
      content: {
        'application/json': {
          schema: resolver(UserWithoutPasswordSchema),
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
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: resolver(ErrorSchema),
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: resolver(ErrorSchema),
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: resolver(ErrorSchema),
        },
      },
    },
  },
});
