import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Valid email format required'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 24 })
      .withMessage('Password must be between 8 and 24 characters'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    console.log('User created');

    throw new DatabaseConnectionError();

    res.send({});
  },
);

export { router as signupRouter };
