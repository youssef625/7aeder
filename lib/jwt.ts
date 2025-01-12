import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  id: string;
  name: string;
  role: string;
}

export function signJWT(payload: JWTPayload): string {
  try {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '24h',
      algorithm: 'HS256'
    });
  } catch (error) {
    console.error('JWT signing error:', error);
    throw error;
  }
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, { 
      algorithms: ['HS256']
    }) as JWTPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}