import express, { Request, Response } from 'express';
import { Tix } from '../models/tix';

const router = express.Router();

router.get('/api/tix', async (req: Request, res: Response) => {
  const tix = await Tix.find({
    orderId: undefined,
  });

  res.send(tix);
});

export { router as indexTixRouter };
