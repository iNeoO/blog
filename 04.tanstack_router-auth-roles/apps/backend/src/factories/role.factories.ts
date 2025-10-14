import type { RoleValue } from 'common';
import { createFactory } from 'hono/factory';
import type { AuthBindings } from './auth.factories.js';

export type RoleBindings = {
  Variables: {
    role: RoleValue;
  } & AuthBindings['Variables'];
};

export const createRoleFactory = createFactory<RoleBindings>();
