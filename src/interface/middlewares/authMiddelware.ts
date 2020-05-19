import { Request, Response, NextFunction } from 'express';
import { existsSync } from 'fs';
import path from 'path';

export default function mdLog(req: Request, res: Response, next: NextFunction) {
  const code: string = req.headers.authorization?.split('?code=')[1] as string;
  const authPath = path.join(__dirname, '../../..', 'lib', 'oauths');
  const exists = existsSync(authPath + '/' + code);
  if (exists) return next();

  res.status(404).json('Access denied');
}