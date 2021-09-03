import express, { Request, Response } from 'express';
import { authWall } from '../middleware/auth-wall';
import { PageNotFound } from '../errors/page-not-found-error';
import { UnAuthorizedError } from '../errors/unauthorized-error';
import { Order } from '../models/order';
import { OrderStatus } from '../middleware/states/order-status';
import { OrderCanceledPublisher } from '../events/publishers/order-canceled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  authWall,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('tix');

    if (!order) {
      throw new PageNotFound();
    }
    if (order.userId !== req.activeUser!.id) {
      throw new UnAuthorizedError();
    }
    order.status = OrderStatus.Canceled;
    await order.save();

    new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      instance: order.instance,
      tix: {
        id: order.tix.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
