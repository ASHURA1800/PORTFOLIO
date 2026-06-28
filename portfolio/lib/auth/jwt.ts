import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)
const JWT_ISSUER = 'portfolio';
const JWT_AUDIENCE = 'portfolio-admin';

export interface SessionPayload {
  email: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  const encoded = new TextEncoder().encode(secret);
  // HS256 requires a minimum 256-bit (32-byte) key
  if (encoded.length < 32) throw new Error('JWT_SECRET must be at least 32 bytes');
  return encoded;
}

/** Sign a session JWT (HS256). Edge-runtime safe. */
export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .sign(getSecret());
}

/** Verify a session JWT. Returns the payload or null if invalid/expired. */
export async function verifyToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      clockTolerance: 30, // seconds — tolerate minor server clock skew
    });
    if (typeof payload.email !== 'string' || !payload.email) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE;

/** Cookie options shared by login (set) and logout (clear). */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  };
}
