export const ROLE = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Role = keyof typeof ROLE;
export type RoleValue = (typeof ROLE)[Role];
