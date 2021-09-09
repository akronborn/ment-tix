import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
const cookieSession = require('cookie-session');
import { newChargeRouter } from './routes/newCharge';

import { errorHandler } from './middleware/error-handler';
import { PageNotFound } from './errors/page-not-found-error';
import { activeUser } from './middleware/active-user-state';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(activeUser);

app.use(newChargeRouter);

app.all('*', async (req, res) => {
  throw new PageNotFound();
});

app.use(errorHandler);

export { app };
