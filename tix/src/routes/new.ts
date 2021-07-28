import express, { Request, Response } from 'express';
import { authWall } from '../middleware/auth-wall';

const router = express.Router();

router.post('/api/tix', authWall, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as newTixRouter };
