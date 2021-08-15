import express, { Request, Response } from 'express';
import { authWall } from '../middleware/auth-wall';
import { validateRequest } from '../middleware/validate-request';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/orders',
  authWall,
  [body('tixId').not().isEmpty().withMessage('TixID required')],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
