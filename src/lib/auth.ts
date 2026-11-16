import { cookies } from 'next/headers';
import { db } from './db';

export type UserRole =
  | 'CONTENT_CREATOR'
  | 'DISTRIBUTION_PARTNER'
  | 'VIDEO_EDITOR'
  | 'QUALITY_REVIEWER'
  | 'CAMPAIGN_MANAGER'
  | 'FINANCE_MANAGER'
  | 'OPERATIONS_ADMIN'
  | 'SUPER_ADMIN'
  | 'SUPPORT_AGENT';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
}

// Default fallback demo user (Creator)
export const DEFAULT_USER_ID = 'usr_creator_acme';

export async function getCurrentUser(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get('clipper_session_user')?.value || DEFAULT_USER_ID;

  const user = await db.user.findUnique({
    where: { id: sessionUserId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      status: true,
    },
  });

  if (!user || user.status === 'SUSPENDED') {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    avatarUrl: user.avatarUrl,
  };
}

export function assertRole(user: AuthSession | null, allowedRoles: UserRole[]) {
  if (!user) {
    throw new Error('UNAUTHORIZED: Authentication required');
  }
  if (!allowedRoles.includes(user.role) && user.role !== 'SUPER_ADMIN') {
    throw new Error(`FORBIDDEN: Insufficient permissions for role ${user.role}`);
  }
}
