// import express, { Request, Response } from 'express';
// import { body } from 'express-validator';
// import { requireAuth, validateRequest } from '@grider-ms-tickets/common';
// import { Ticket } from '../models/Ticket';

// const router = express.Router();

// router.post(
//   '/api/tickets',
//   requireAuth,
//   [
//     body('title').not().isEmpty().withMessage('Title is required'),
//     body('price')
//       .isFloat({ gt: 0 })
//       .withMessage('Price must be greater than 0'),
//   ],
//   validateRequest,
//   async (req: Request, res: Response) => {
//     const { title, price } = req.body;
//     const ticket = Ticket.build({
//       title,
//       price,
//       userId: req.currentUser!.id,
//     });
//     await ticket.save();
//     return res.status(201).send(ticket);
//   }
// );

// export { router as createTicketRouter };

import express from 'express';
import {Request,Response} from 'express';
import {  validateRequest,requireAuthorization } from '@jrk1718tickets/common';
import { body } from 'express-validator';
import { Ticket,buildTicket } from '../models/Tickets';

const createTicket=express.Router();

createTicket.post('/api/tickets',
requireAuthorization,
  [
    body('title').not().isEmpty().withMessage('Title attribute is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be always greater than or equal to 0'),
  ],
  validateRequest,
async (req : Request,res : Response)=>{
  
  const {title,price}=req.body;
  //     const ticket = Ticket.build({
  //       title,
  //       price,
  //       userId: req.currentUser!.id,
  //     });
  //     await ticket.save();
  //     return res.status(201).send(ticket);

  const ticket=buildTicket({
    title,
    price,
    userId : req.currentUser!.id
  });

   await ticket.save();
   return res.status(201).send(ticket);
});

export {createTicket};