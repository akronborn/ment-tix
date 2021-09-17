import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { authWall } from '../middleware/auth-wall';
import { validateRequest } from '../middleware/validate-request';
import { Tix } from '../models/tix';
import { TixCreatedPublisher } from '../events/publishers/tix-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tix',
  authWall,
  [
    body('title')
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage('Title with at least 5 characters required'),
    body('content')
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage('Description required'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, content, price } = req.body;

    const tix = Tix.build({
      title,
      content,
      price,
      userId: req.activeUser!.id,
    });
    await tix.save();
    await new TixCreatedPublisher(natsWrapper.client).publish({
      id: tix.id,
      instance: tix.instance,
      title: tix.title,
      content: tix.content,
      price: tix.price,
      userId: tix.userId,
    });

    res.status(201).send(tix);
  }
);

export { router as newTixRouter };
