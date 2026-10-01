import { SessionUser } from './auth';
import { NextResponse } from 'next/server';

export type UserRole = 'INVESTOR' | 'BUSINESS' | 'ADMIN';

export function checkRole(user: SessionUser | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

export function authorizeRole(user: SessionUser | null, allowedRoles: UserRole[]): NextResponse | null {
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
  }

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
  }

  return null;
}

export function canAccessInvestorData(currentUser: SessionUser, targetUserId: string): boolean {
  if (currentUser.role === 'ADMIN') return true;
  return currentUser.role === 'INVESTOR' && currentUser.userId === targetUserId;
}

export function canModifyBusinessData(currentUser: SessionUser, businessOwnerUserId: string): boolean {
  if (currentUser.role === 'ADMIN') return true;
  return currentUser.role === 'BUSINESS' && currentUser.userId === businessOwnerUserId;
}
