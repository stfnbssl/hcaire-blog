import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';

export interface ClerkRequest extends Request {
  clerkUserId?: string;
}

export const authenticateClerk = async (
  req: ClerkRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Clerk token required' });
    return;
  }

  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
    req.clerkUserId = payload.sub;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired Clerk token' });
  }
};
