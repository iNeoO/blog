import { validator as zValidator } from "hono-openapi";
import { createLoggerFactory } from "../../factories/logger.factories.js";
import { getUserRoute, getUsersRoute, postUserRoute } from "./users.route.js";
import { CreateUserSchema } from "./users.schema.js";
import { createUser, getUser, getUsers } from "./users.service.js";

const app = createLoggerFactory
  .createApp()
  .get("/:id", getUserRoute, (c) => {
    const id = c.req.param("id");

    const user = getUser(id);

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json(user);
  })
  .get("/", getUsersRoute, (c) => {
    const users = getUsers();
    return c.json(users);
  })
  .post("/", postUserRoute, zValidator("json", CreateUserSchema), async (c) => {
    const { name, age } = await c.req.valid("json");

    const newUser = createUser(name, age);

    const logger = c.get("logger");

    logger.info({ user: newUser }, "Creating new user from controller");

    return c.json(newUser, 201);
  });

export default app;
