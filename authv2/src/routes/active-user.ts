import express from 'express';
import { activeUser } from '../middleware/active-user-state';

const router = express.Router();

router.get('/api/users/activeuser', activeUser, (req, res) => {
  res.send({ activeUser: req.activeUser || null });
});

export { router as activeUserRouter };
