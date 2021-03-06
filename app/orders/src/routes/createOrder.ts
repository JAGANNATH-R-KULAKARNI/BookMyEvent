import express,{Request,Response} from 'express';
import mongoose from 'mongoose';
import {
  requireAuthorization,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@jrk1718tickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';
import { OrderCreatedPublisher } from '../events/publishers/orderCreatedPublisher';
import { natsWrapper } from '../natsWrapper';

const CreateOrder=express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

CreateOrder.post('/api/orders',
requireAuthorization,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided ans It mush be moongoose ID type'),
  ],
  validateRequest,
async (req:Request,res :Response)=>{
 
  const { ticketId } = req.body;

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  const isReserved = await ticket.isReserved();

  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved');
  }

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });

  await order.save();

  new OrderCreatedPublisher(natsWrapper.client).publish({
  id : order.id,
  status : order.status,
  userId : order.userId,
  expiresAt : order.expiresAt.toISOString(), //convert to UTC timestamp
  ticket : {
    id : ticket.id,
    price : ticket.price
  }
});

  return res.status(201).send(order);

});

export {CreateOrder};