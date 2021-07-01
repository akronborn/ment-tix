import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middleware/validate-request';
import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email already registered');
    }

    const user = User.build({ email, password });
    await user.save();

    //Generate JWT
    const userToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    //Store user token on session object
    req.session = {
      jwt: userToken,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
