import { pinoLogger } from 'hono-pino';
import { createLoggerFactory } from '../factories/logger.factories.js';
import { loggerStorage } from '../utils/asyncLocalStorage.js';
import { createLogger } from '../utils/logger.util.js';

export const loggerMiddleware = createLoggerFactory.createMiddleware(async (c, next) => {
  const basePinoLogger = pinoLogger({ pino: createLogger() });
  return basePinoLogger(c, async () => {
    const logger = c.get('logger');
    return loggerStorage.run(logger, async () => {
      return await next();
    });
  });
});
