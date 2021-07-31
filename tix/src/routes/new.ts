import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { authWall } from '../middleware/auth-wall';
import { validateRequest } from '../middleware/validate-request';
import { Tix } from '../models/tix';

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
  async (req: Request, res: Response) => {
    const { title, body, price } = req.body;

    const tix = Tix.build({
      title,
      body,
      price,
      userId: req.activeUser!.id,
    });
    await tix.save();

    res.status(201).send(tix);
  }
);

export { router as newTixRouter };
