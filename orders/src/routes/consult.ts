import express, { Request, Response } from 'express';
import { authWall } from '../middleware/auth-wall';
import { PageNotFound } from '../errors/page-not-found-error';
import { UnAuthorizedError } from '../errors/unauthorized-error';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  authWall,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('tix');

    if (!order) {
      throw new PageNotFound();
    }
    if (order.userId !== req.activeUser!.id) {
      throw new UnAuthorizedError();
    }

    res.send(order);
  }
);

export { router as consultOrderRouter };
