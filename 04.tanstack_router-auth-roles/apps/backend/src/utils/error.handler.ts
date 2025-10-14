import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { LoggerBindings } from '../factories/logger.factories.js';

export const errorHandler: ErrorHandler<LoggerBindings> = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  const logger = c.get('logger');
  logger.error({ err }, 'Internal server error');
  return c.json({ message: 'Internal server error' }, 500);
};
