import express from 'express';
import jwt from 'jsonwebtoken';
import { UnAuthorizedError } from '../errors/unauthorized-error';

import { activeUser } from '../middleware/active-user-state';
import { authWall } from '../middleware/auth-wall';

const router = express.Router();

router.get('/api/users/activeuser', activeUser, authWall, (req, res) => {
  res.send({ activeUser: req.activeUser || null });
});

export { router as activeUserRouter };
