import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Secret } from '../services/secret';
import { User } from '../models/user';
import { validateRequest } from '../middleware/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/users/login',
  [
    body('email').isEmail().withMessage('Must input valid email address'),
    body('password').trim().notEmpty().withMessage('Email required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const registeredUser = await User.findOne({ email });
    if (!registeredUser) {
      throw new BadRequestError('Email not found');
    }
    //compare provided password with the password linked to this registered email
    const secretsMatch = await Secret.compare(
      registeredUser.password,
      password
    );
    if (!secretsMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    //Generate JWT
    const userToken = jwt.sign(
      {
        id: registeredUser.id,
        email: registeredUser.email,
      },
      process.env.JWT_KEY!
    );

    //Store registeredUser token on session object
    req.session = {
      jwt: userToken,
    };

    res.status(200).send(registeredUser);
  }
);

export { router as loginRouter };
