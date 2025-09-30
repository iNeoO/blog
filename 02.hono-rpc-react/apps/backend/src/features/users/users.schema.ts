import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
});

export const UsersSchema = z.array(UserSchema);

export const ErrorSchema = z.object({
  message: z.string(),
  cause: z
    .object({
      code: z.string().optional(),
      message: z.string().optional(),
      stack: z.string().optional(),
    })
    .optional(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  age: z.number().min(0, { message: 'Age must be a positive number' }),
});
