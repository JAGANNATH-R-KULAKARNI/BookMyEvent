import express,{Request,Response} from 'express';
import {
  NotFoundError,
  UnAuthorizedError,
  requireAuthorization
} from '@jrk1718tickets/common';
import { Order } from '../models/Order';

const GetAOrder=express.Router();

GetAOrder.get('/api/orders/:orderId',requireAuthorization, async (req:Request,res :Response)=>{
 
  const order = await Order.findById(req.params.orderId).populate('ticket');
//.populate() is being used in order to bring only needed information.
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthorizedError();
  }

  return res.send(order);
 
});

export {GetAOrder};

/*
.populate() is being used in order to bring only needed information.

EXAMPLE without .populate()

User.findOne({ name: Bob })
Will return

{
  Bob : {
    _id : dasd348ew,
    email: bob@example.com,
    age: 25,
    job: teacher,
    nationality: American,
  }
}
EXAMPLE with .populate()

User.findOne({ name: Bob }).populate("Bob", "job email")
Will return

{
  Bob : {
    job: teacher,
    email: bob@example.com,
  }
}
*/