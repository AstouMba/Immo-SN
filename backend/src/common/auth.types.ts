export type UserRole = 'user' | 'admin';

export interface AuthUser {
  sub: string;
  email: string;
  role: UserRole;
}
