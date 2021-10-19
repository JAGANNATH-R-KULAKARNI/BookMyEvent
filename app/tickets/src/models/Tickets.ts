import mongoose from 'mongoose';

interface TicketParameters{
title : string;
price : number;
userId : string;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const Ticket=mongoose.model('Ticket',ticketSchema);

const buildTicket = (ticket : TicketParameters)=>{
     return new Ticket(ticket);
}

export {Ticket,buildTicket}