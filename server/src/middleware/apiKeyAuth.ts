import { Request, Response, NextFunction } from 'express';

export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <key>

  if (!token) {
    res.status(401).json({ error: 'API key required' });
    return;
  }

  if (token !== process.env.COWORK_API_KEY) {
    res.status(403).json({ error: 'Invalid API key' });
    return;
  }

  next();
};
