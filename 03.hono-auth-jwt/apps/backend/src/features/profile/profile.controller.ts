import { HTTPException } from "hono/http-exception";
import { createAuthFactory } from "../../factories/auth.factories.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getUser } from "../users/users.service.js";
import { getProfileRoute } from "./profile.route.js";

const app = createAuthFactory
  .createApp()
  .use(authMiddleware)
  .get("/me", getProfileRoute, (c) => {
    const logger = c.get("logger");
    const userId = c.get("userId");

    const user = getUser(userId);

    if (!user) {
      // shouldn't happen
      logger.error({ userId }, "User not found in profile route");
      throw new HTTPException(500, { message: "User not found" });
    }

    return c.json({ id: user.id, email: user.email, role: user.role });
  });

export default app;
