import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { authWall } from '../middleware/auth-wall';
import { validateRequest } from '../middleware/validate-request';
import { PageNotFound } from '../errors/page-not-found-error';
import { UnAuthorizedError } from '../errors/unauthorized-error';

import { Tix } from '../models/tix';

const router = express.Router();

router.put(
  '/api/tix/:id',
  authWall,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('content').not().isEmpty().withMessage('Description required'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('A price greater than zero is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const tix = await Tix.findById(req.params.id);

    if (!tix) {
      throw new PageNotFound();
    }

    if (tix.userId !== req.activeUser!.id) {
      throw new UnAuthorizedError();
    }

    tix.set({
      title: req.body.title,
      content: req.body.content,
      price: req.body.price,
    });
    await tix.save();

    res.send(tix);
  }
);

export { router as updateTixRouter };
