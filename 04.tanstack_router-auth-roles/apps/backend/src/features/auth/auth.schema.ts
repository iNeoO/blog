import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const LogoutSchema = z.object({
  message: z.string(),
});
