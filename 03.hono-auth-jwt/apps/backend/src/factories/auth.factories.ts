import type { LoggerBindings } from "./logger.factories.js";
import { createFactory } from "hono/factory";

export type AuthBindings = {
  Variables: {
    userId: string;
  } & LoggerBindings["Variables"];
};

export const createAuthFactory = createFactory<AuthBindings>();
