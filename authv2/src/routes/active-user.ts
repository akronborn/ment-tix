import express from 'express';

const router = express.Router();

router.get('/api/users/activeuser', (req, res) => {
  res.send('Route established');
});

export { router as activeUserRouter };
