import mongoose from 'mongoose';

import { Order,OrderStatus} from './Order';

interface TicketAttrs {
  id : string; //when ticket service emmits ticket we need to receieve ack ,so 
  //we need to have consistency in id's that is the reason we added id
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;  //Whether the ticket is reserved or not
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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
      min: 0,
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id : attrs.id, //Because mongoDB accepts _id only as identity
    title : attrs.title,
    price : attrs.price
  });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [   //Its a mongoDB function
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,             //if ticket is created or awaitingPayment or completed the ticket is not available
      ],
    },
  });

  return !!existingOrder;     //If existingOrder is null it will be flipped to true and in turn it will be flipped back to false
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };