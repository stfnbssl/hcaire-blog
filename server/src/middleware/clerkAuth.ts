import { Request, Response, NextFunction } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import { createClerkClient } from '@clerk/backend';

export interface ClerkRequest extends Request {
  clerkUserId?: string;
}

// Controlla se un utente Clerk ha role === 'admin' nei publicMetadata.
// Da usare solo dove strettamente necessario (chiama le API Clerk).
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const user = await clerkClient.users.getUser(userId);
    return user.publicMetadata?.role === 'admin';
  } catch {
    return false;
  }
}

// Richiede autenticazione Clerk (401 se assente, 403 se token non valido).
// Usa @clerk/express che legge sia cookie che Bearer token.
export const authenticateClerk = requireAuth();

// Imposta clerkUserId se l'utente è autenticato, prosegue comunque se assente.
// Funziona perché clerkMiddleware() è già applicato globalmente in index.ts.
export const optionalClerkAuth = (
  req: ClerkRequest,
  _res: Response,
  next: NextFunction
): void => {
  const auth = getAuth(req);
  req.clerkUserId = auth.userId ?? undefined;
  next();
};

// Da usare dopo authenticateClerk: verifica che l'utente abbia role === 'admin'.
export const requireAdmin = async (
  req: ClerkRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    res.status(401).json({ error: 'Autenticazione richiesta' });
    return;
  }

  try {
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role !== 'admin') {
      res.status(403).json({ error: 'Accesso riservato agli amministratori' });
      return;
    }
    req.clerkUserId = userId;
    next();
  } catch {
    res.status(403).json({ error: 'Impossibile verificare i permessi utente' });
  }
};
