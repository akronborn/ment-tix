import express, { Request, Response } from 'express';
import { Tix } from '../models/tix';
import { PageNotFound } from '../errors/page-not-found-error';

const router = express.Router();

router.get('/api/tix/:id', async (req: Request, res: Response) => {
  const tix = await Tix.findById(req.params.id);

  if (!tix) {
    throw new PageNotFound();
  }

  res.send(tix);
});

export { router as consultTixRouter };
