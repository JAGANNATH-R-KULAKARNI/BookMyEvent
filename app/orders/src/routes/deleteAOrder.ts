import express,{Request,Response} from 'express';
import { requireAuthorization,
  NotFoundError,
  UnAuthorizedError
 } from '@jrk1718tickets/common';
import {Order,OrderStatus} from '../models/Order';
import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher';
import { natsWrapper } from '../natsWrapper';

const DeleteAOrder=express.Router();

DeleteAOrder.delete('/api/orders/:orderId',requireAuthorization,
async (req:Request,res :Response)=>{
 
  const order = await Order.findById(req.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();
 
  new OrderCancelledPublisher(natsWrapper.client).publish({
  id : order.id,
  ticket : {
    id : order.ticket.id,
  }
  });

  return res.status(204).send(order);
 
});

export {DeleteAOrder};