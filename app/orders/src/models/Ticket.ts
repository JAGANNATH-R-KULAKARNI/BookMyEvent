import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'
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
  version : number;
  isReserved(): Promise<boolean>;  //Whether the ticket is reserved or not
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);
//This plugin brings optimistic concurrency control to Mongoose documents by 
//incrementing document version numbers on each save, and preventing previous 
//versions of a document from being saved over the current version.


//This function solves concurrancy issues. The requested event version should be one version ahead of previous version in database 
//or eles its not updated
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

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