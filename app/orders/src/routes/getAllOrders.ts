import express,{Request,Response} from 'express';
import {
  requireAuthorization,
} from '@jrk1718tickets/common';
import { Order } from '../models/Order';

const GetAllOrders=express.Router();

GetAllOrders.get('/api/orders',async (req:Request,res :Response)=>{
 
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');
//Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s). We may populate a single document, multiple documents, a plain object, multiple plain objects, or all objects returned from a query. Let's look at some examples.
  return res.send(orders);
 
});

export {GetAllOrders};

// Links
// https://mongoosejs.com/docs/populate.html