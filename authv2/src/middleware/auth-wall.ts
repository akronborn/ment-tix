import { Request, Response, NextFunction } from 'express';
import { UnAuthorizedError } from '../errors/unauthorized-error';

export const authWall = (req: Request, res: Response, next: NextFunction) => {
  if (!req.activeUser) {
    throw new UnAuthorizedError();
  }

  next();
};
