import express from 'express';
import { json} from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError } from '@jrk1718tickets/common';
import { errorHandler } from '@jrk1718tickets/common';
import { currentUser} from '@jrk1718tickets/common';

import { createTicket } from './routes/createTicket';
import { allTickets } from './routes/allTickets';
import { showTicket } from './routes/showTicket';
import { updateTicket } from './routes/updateTicket';

const app=express();

app.set('trust proxy', true);
app.use(json());

app.use(
  cookieSession({
    signed: false, 
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(createTicket);
app.use(allTickets);
app.use(showTicket);
app.use(updateTicket);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};