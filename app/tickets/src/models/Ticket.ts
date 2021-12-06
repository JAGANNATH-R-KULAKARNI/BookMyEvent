import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface TicketParameters{
title : string;
price : number;
userId : string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version : number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketParameters): TicketDoc;
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

ticketSchema.set('versionKey','version');
//previosly version was named as '__v' , that name is changed to 'version'
ticketSchema.plugin(updateIfCurrentPlugin);
//This plugin brings optimistic concurrency control to Mongoose documents by incrementing document version 
//numbers on each save, and preventing previous versions of a document from being saved over the current version.

ticketSchema.statics.build = (attrs: TicketParameters) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket}