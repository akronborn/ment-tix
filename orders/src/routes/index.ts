import express, { Request, Response } from 'express';
import { authWall } from '../middleware/auth-wall';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', authWall, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.activeUser!.id,
  }).populate('tix');

  res.send(orders);
});

export { router as indexOrderRouter };
