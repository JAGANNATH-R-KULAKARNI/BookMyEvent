import express from 'express';
import { json} from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError } from '@jrk1718tickets/common';
import { errorHandler } from '@jrk1718tickets/common';
import { currentUser} from '@jrk1718tickets/common';

import {CreateOrder} from './routes/createOrder';
import { DeleteAOrder } from './routes/deleteAOrder';
import { GetAllOrders } from './routes/getAllOrders';
import { GetAOrder } from './routes/getAOrder';

const app=express();

app.set('trust proxy', true);
app.use(json());

app.use(
  cookieSession({
    signed: false, 
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);//For signIn its very important
app.use(CreateOrder);
app.use(GetAOrder);
app.use(GetAllOrders);
app.use(DeleteAOrder);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};