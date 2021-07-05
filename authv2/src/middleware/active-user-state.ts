import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayLoad {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      activeUser?: UserPayLoad;
    }
  }
}

export const activeUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayLoad;
    req.activeUser = payload;
  } catch (err) {}
  next();
};
