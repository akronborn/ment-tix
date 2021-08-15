import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
const cookieSession = require('cookie-session');

import { errorHandler } from './middleware/error-handler';
import { PageNotFound } from './errors/page-not-found-error';
import { activeUser } from './middleware/active-user-state';

import { newOrderRouter } from './routes/new';
import { consultOrderRouter } from './routes/consult';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';

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

app.use(newOrderRouter);
app.use(consultOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req: Request, res: Response) => {
  throw new PageNotFound();
});

app.use(errorHandler);

export { app };
