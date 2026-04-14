import { Request, Response, NextFunction } from 'express';
import { verifyToken, createClerkClient } from '@clerk/backend';

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

// Tenta di identificare l'utente ma non blocca se il token è assente o non valido
export const optionalClerkAuth = async (
  req: ClerkRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    try {
      const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
      req.clerkUserId = payload.sub;
    } catch {
      // token non valido — prosegui come utente anonimo
    }
  }
  next();
};

// Da usare dopo authenticateClerk: verifica che l'utente abbia role === 'admin'
export const requireAdmin = async (
  req: ClerkRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.clerkUserId) {
    res.status(401).json({ error: 'Autenticazione richiesta' });
    return;
  }
  try {
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const user = await clerkClient.users.getUser(req.clerkUserId);
    if (user.publicMetadata?.role !== 'admin') {
      res.status(403).json({ error: 'Accesso riservato agli amministratori' });
      return;
    }
    next();
  } catch {
    res.status(403).json({ error: 'Impossibile verificare i permessi utente' });
  }
};
