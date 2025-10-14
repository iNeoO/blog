import { Hono } from "hono";
import { csrf } from "hono/csrf";
import authController from "./features/auth/auth.controller.js";
import profileController from "./features/profile/profile.controller.js";
import usersController from "./features/users/users.controller.js";
import { loggerMiddleware } from "./middlewares/pino.middleware.js";
import { errorHandler } from "./utils/error.handler.js";

const app = new Hono()
  .use(csrf())
  .use(loggerMiddleware)
  .route("/auth", authController)
  .route("/users", usersController)
  .route("/profile", profileController)
  .onError(errorHandler);

export default app;
