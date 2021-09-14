import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PageNotFound } from '../errors/page-not-found-error';
import { BadRequestError } from '../errors/bad-request-error';
import { authWall } from '../middleware/auth-wall';
import { validateRequest } from '../middleware/validate-request';
import { UnAuthorizedError } from '../errors/unauthorized-error';
import { Order } from '../models/order';
import { OrderStatus } from '../events/states/order-status';
import { stripe } from '../stripe';
import { Transaction } from '../models/transaction';
import { TransactionCreatedPublisher } from '../events/publishers/transaction-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/transactions',
  authWall,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new PageNotFound();
    }
    if (order.userId !== req.activeUser!.id) {
      throw new UnAuthorizedError();
    }
    if (order.status === OrderStatus.Canceled) {
      throw new BadRequestError(
        'Order canceled/invalid: Payment Not Permitted'
      );
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });
    const transaction = Transaction.build({
      orderId,
      stripeId: charge.id,
    });

    await transaction.save();

    await new TransactionCreatedPublisher(natsWrapper.client).publish({
      id: transaction.id,
      orderId: transaction.orderId,
      stripeId: transaction.stripeId,
    });

    res.status(201).send({ id: transaction.id });
  }
);

export { router as newChargeRouter };
