import { createClient } from '@supabase/supabase-js';
import { SignOptions } from 'jsonwebtoken';

// JWT Secret for verification purposes
const JWT_SECRET = import.meta.env.JWT_SECRET || '77SDdJ9QlFQFG8bViyJKmcqEy8y/vVYmQIsmmETnHu/j0A6A0DvuPcp5WUb8qao59ylkr5AweI4SwSRvDZw4JQ==';

/**
 * Verify a JWT token using the secret
 * For server-side use only
 */
export const verifyJWT = async (token: string) => {
  try {
    // Import jsonwebtoken dynamically to avoid client-side inclusion
    const { verify } = await import('jsonwebtoken');
    return verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
};

/**
 * Create a JWT token
 * For server-side use only
 */
export const createJWT = async (payload: object, options: SignOptions = { expiresIn: '1h' }) => {
  try {
    // Import jsonwebtoken dynamically to avoid client-side inclusion
    const { sign } = await import('jsonwebtoken');
    return sign(payload, JWT_SECRET, options);
  } catch (error) {
    console.error('JWT creation error:', error);
    return null;
  }
}; 