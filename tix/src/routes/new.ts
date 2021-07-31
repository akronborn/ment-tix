import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { authWall } from '../middleware/auth-wall';
import { validateRequest } from '../middleware/validate-request';

const router = express.Router();

router.post(
  '/api/tix',
  authWall,
  [
    body('title').not().isEmpty().withMessage('Title required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { router as newTixRouter };
