import express,{Request,Response} from 'express';
import { Ticket } from '../models/Tickets';

const router=express.Router();

router.get('/api/tickets',async (req: Request,res : Response)=>{

  const tickets=await Ticket.find({});

  return res.send(tickets);
});

export {router as allTickets};