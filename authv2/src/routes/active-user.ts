import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/activeuser', (req, res) => {
  if (!req.session || !req.session.jwt) {
    return res.send({ activeUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ activeUser: payload });
  } catch (err) {
    res.send({ activeUser: null });
  }
});

export { router as activeUserRouter };
