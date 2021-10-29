import express,{Request,Response} from 'express';
import { NotFoundError } from '@jrk1718tickets/common';
import { Ticket } from '../models/Tickets';

const router=express.Router();

router.get('/api/tickets/:id',async (req : Request,res : Response)=>{
  const ticket=await Ticket.findById(req.params.id);

  if(!ticket){
    throw new NotFoundError();
  }

  return res.status(200).send(ticket);
});

export {router as showTicket};