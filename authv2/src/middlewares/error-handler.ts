import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('Action failed', err);

  res.status(400).send({
    message: 'Action failed',
  });
};
