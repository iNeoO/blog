import { Hono } from "hono";
import usersController from "./features/users/users.controller.js";
import { loggerMiddleware } from "./middlewares/pino.middleware.js";

const app = new Hono().use(loggerMiddleware).route("/users", usersController);

export default app;
