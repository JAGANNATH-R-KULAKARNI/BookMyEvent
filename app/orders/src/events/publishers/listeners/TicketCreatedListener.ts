import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from '@jrk1718tickets/common';
import { queueGroupName } from './QueueGroupName';

import { Ticket } from '../../../models/Ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const {  id,title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();
  //when ticket is created in ticket serive it emitts event and order service receives it
  //then stores the ticket in local collection

    msg.ack();
  }
}

//Orders need to know the valid tickets that can be purchased
//Order needs to know the price of each ticket
