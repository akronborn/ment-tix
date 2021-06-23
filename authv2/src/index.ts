import express from 'express';
import { json } from 'body-parser';
import { activeUserRouter } from './routes/active-user';
import { signupRouter } from './routes/signup';
import { loginRouter } from './routes/login';
import { logoutRouter } from './routes/logout';
import { errorHandler } from './middleware/error-handler';

const app = express();
app.use(json());

app.use(activeUserRouter);
app.use(signupRouter);
app.use(loginRouter);
app.use(logoutRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
