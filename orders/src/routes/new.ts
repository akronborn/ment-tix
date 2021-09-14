import express, { Request, Response } from 'express';

import { authWall } from '../middleware/auth-wall';
import { validateRequest } from '../middleware/validate-request';
import { PageNotFound } from '../errors/page-not-found-error';
import { BadRequestError } from '../errors/bad-request-error';
import { OrderStatus } from '../middleware/states/order-status';

import { body } from 'express-validator';
import { Tix } from '../models/tix';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const setExpirationTime = 1 * 60;

router.post(
  '/api/orders',
  authWall,
  [body('tixId').not().isEmpty().withMessage('TixID required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { tixId } = req.body;

    // Find tix
    const tix = await Tix.findById(tixId);
    if (!tix) {
      throw new PageNotFound();
    }
    //Confirm tix is not already reserved
    const isReserved = await tix.isReserved();
    if (isReserved) {
      throw new BadRequestError('Tix already reserved');
    }

    //Set order completion expiration time
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + setExpirationTime);

    //Build and save order

    const order = Order.build({
      userId: req.activeUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      tix,
    });
    await order.save();

    //Emit order completion event
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      instance: order.instance,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      tix: {
        id: tix.id,
        price: tix.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
