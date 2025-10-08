import { describeRoute, resolver } from "hono-openapi";
import {
  ErrorSchema,
  ZodSafeParseErrorSchema,
} from "../../utils/error.schema.js";
import {
  UserWithoutPasswordSchema,
  UsersWithoutPasswordSchema,
} from "./users.schema.js";

export const getUserRoute = describeRoute({
  tags: ["Users"],
  responses: {
    200: {
      description: "Retrieve user by ID",
      content: {
        "application/json": {
          schema: resolver(UserWithoutPasswordSchema),
        },
      },
    },
    400: {
      description: "Error",
      content: {
        "application/json": {
          schema: resolver(ErrorSchema),
        },
      },
    },
  },
});

export const getUsersRoute = describeRoute({
  tags: ["Users"],
  responses: {
    200: {
      description: "Retrieve users",
      content: {
        "application/json": {
          schema: resolver(UsersWithoutPasswordSchema),
        },
      },
    },
  },
});

export const postUserRoute = describeRoute({
  tags: ["Users"],
  responses: {
    201: {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: resolver(UserWithoutPasswordSchema),
        },
      },
    },
    400: {
      description: "Invalid input",
      content: {
        "application/json": {
          schema: resolver(ZodSafeParseErrorSchema),
        },
      },
    },
  },
});
