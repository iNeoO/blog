import { ROLE } from 'common';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  role: z.enum(Object.values(ROLE)),
  password: z.string(),
});

export const UserWithoutPasswordSchema = UserSchema.omit({
  password: true,
});

export const UsersWithoutPasswordSchema = z.array(UserWithoutPasswordSchema);

export const UserCreationSchema = z.object({
  email: z.email().min(1, { message: 'Email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const UserUpdateSchema = z.object({
  email: z.email().optional(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).optional(),
  role: z.enum(Object.values(ROLE)).optional(),
});
