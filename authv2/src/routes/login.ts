import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';

const router = express.Router();

router.post(
  '/api/users/login',
  [
    body('email').isEmail().withMessage('Must input valid email address'),
    body('password').trim().notEmpty().withMessage('Email required'),
  ],
  validateRequest,
  (req: Request, res: Response) => {}
);

export { router as loginRouter };
