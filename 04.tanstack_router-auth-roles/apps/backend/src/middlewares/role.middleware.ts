import type { RoleValue } from 'common';
import { createRoleFactory } from '../factories/role.factories.js';
import { getUser } from '../features/users/users.service.js';
import { HTTPException403Forbidden } from '../utils/apiError.util.js';

export const roleMiddleware = (roles: RoleValue[]) =>
  createRoleFactory.createMiddleware(async (c, next) => {
    const logger = c.get('logger');
    const userId = c.get('userId');
    const user = getUser(userId);
    if (!user) {
      logger.error({ userId }, 'User not found in role middleware');
      throw HTTPException403Forbidden('Access denied');
    }
    if (!roles.includes(user.role)) {
      logger.warn({ userId, role: user.role }, 'User role not permitted');
      throw HTTPException403Forbidden('Access denied');
    }
    c.set('role', user.role);
    return await next();
  });
