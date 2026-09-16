import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from './env';

const { sign, verify } = jwt;

export function signAccessTokenFor(userId: string) {
  return sign({ sub: userId }, env.JWT_SECRET, { expiresIn: '3d' });
}

export function validateAccessToken(token: string) {
  try {
    const { sub } = verify(token, env.JWT_SECRET) as JwtPayload;

    return sub ?? null;
  } catch {
    return null;
  }
}
