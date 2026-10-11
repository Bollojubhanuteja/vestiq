import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const DEV_FALLBACK_SECRET = 'vestiq-dev-jwt-super-secret-key-32-chars-long-minimum-secure';

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

  if (!secret) {
    if (isProduction) {
      throw new Error('[SECURITY FATAL] JWT_SECRET is not configured in production environment. Refusing to operate with fallback credentials.');
    }
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }

  if (isProduction && secret === DEV_FALLBACK_SECRET) {
    throw new Error('[SECURITY FATAL] Insecure default development JWT_SECRET is used in production. A cryptographically secure production secret is required.');
  }

  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = 'vestiq_session';

export interface SessionUser {
  userId: string;
  email: string;
  role: 'INVESTOR' | 'BUSINESS' | 'ADMIN';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: SessionUser): Promise<string> {
  const secretKey = getJwtSecretKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as 'INVESTOR' | 'BUSINESS' | 'ADMIN',
      name: payload.name as string,
    };
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch (err) {
    return null;
  }
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionUser | null> {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;
    return await verifyToken(token);
  } catch (err) {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  name: COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};
