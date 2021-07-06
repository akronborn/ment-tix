import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

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

export { app };
