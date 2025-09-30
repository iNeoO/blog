export const ROLE = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest",
} as const;

export type Role = keyof typeof ROLE;
