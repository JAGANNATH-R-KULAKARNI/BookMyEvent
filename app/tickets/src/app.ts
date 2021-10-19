import express from 'express';
import { json} from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError } from '@jrk1718tickets/common';
import { errorHandler } from '@jrk1718tickets/common';
import { currentUser} from '@jrk1718tickets/common';

import { createTicket } from './routes/createTicket';

const app=express();

app.set('trust proxy', true);
app.use(json());

app.use(
  cookieSession({
    signed: false, 
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(createTicket);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};