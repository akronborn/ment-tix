import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { activeUserRouter } from './routes/active-user';
import { signupRouter } from './routes/signup';
import { loginRouter } from './routes/login';
import { logoutRouter } from './routes/logout';
import { errorHandler } from './middleware/error-handler';
import { PageNotFound } from './errors/page-not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(activeUserRouter);
app.use(signupRouter);
app.use(loginRouter);
app.use(logoutRouter);

app.all('*', async (req, res) => {
  throw new PageNotFound();
});

app.use(errorHandler);

const startDB = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('Keys must be defined');
  }

  try {
    await mongoose.connect('mongodb://authv2-mongo-srv:27017/authv2', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Database connection established');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

startDB();
