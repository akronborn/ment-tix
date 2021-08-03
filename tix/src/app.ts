import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
const cookieSession = require('cookie-session');

import { errorHandler } from './middleware/error-handler';
import { PageNotFound } from './errors/page-not-found-error';
import { activeUser } from './middleware/active-user-state';

import { newTixRouter } from './routes/new';
import { consultTixRouter } from './routes/consult';
import { indexTixRouter } from './routes';

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

app.use(newTixRouter);
app.use(consultTixRouter);
app.use(indexTixRouter);

app.all('*', async (req, res) => {
  throw new PageNotFound();
});

app.use(errorHandler);

export { app };
