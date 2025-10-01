import { ROLE } from 'common';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.enum(Object.values(ROLE)),
});

export const UsersSchema = z.array(UserSchema);

export const CreateUserSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});
