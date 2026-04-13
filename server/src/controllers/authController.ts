import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// TODO: in produzione usare bcrypt per hashare la password
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body as { username: string; password: string };

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Credenziali non valide' });
    return;
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  res.json({ token, username });
};

export const logout = (_req: Request, res: Response): void => {
  // JWT è stateless: il client rimuove il token dal localStorage
  res.json({ message: 'Logout effettuato' });
};
