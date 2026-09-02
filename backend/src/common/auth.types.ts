import type { UserRole } from '@prisma/client';

export type { UserRole };

export interface AuthUser {
  sub: string;
  email: string;
  role: UserRole;
}