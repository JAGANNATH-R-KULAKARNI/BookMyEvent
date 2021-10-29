import express,{Request,Response} from 'express';
import {body} from 'express-validator';
import { validateRequest } from '@jrk1718tickets/common';
import { NotFoundError } from '@jrk1718tickets/common';
import { requireAuthorization } from '@jrk1718tickets/common';
import { UnAuthorizedError } from '@jrk1718tickets/common';
import { Ticket } from '../models/Tickets';

const router=express.Router();

router.put('/api/tickets/:id',
[
  body('title').not().isEmpty().withMessage('Title is necessary'),
  body('price').isFloat({gt : 0})
  .withMessage('Price is required and it must be greater tha or equal to zero')
]
,
requireAuthorization,
async(req : Request,res : Response)=>{

  const ticket=await Ticket.findById(req.params.id);

  if(!ticket){
    throw new NotFoundError();
  }
  //req.currentUser! is used to check whether currentUser is defined or not
  if(ticket.userId !== req.currentUser!.id){
      throw new UnAuthorizedError();
  }

  ticket.set({
    title : req.body.title,
    price : req.body.price
  });

  await ticket.save();

  return res.status(200).send(ticket);
});

export {router as updateTicket};