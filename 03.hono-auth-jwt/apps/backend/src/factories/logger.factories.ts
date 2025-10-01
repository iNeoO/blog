import { createFactory } from 'hono/factory';

import type { PinoLogger } from 'hono-pino';

export type LoggerBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

export const createLoggerFactory = createFactory<LoggerBindings>();
