import {Message} from 'node-nats-streaming';
import { Listener } from '@jrk1718tickets/common';
import { TicketCreatedEvent } from '@jrk1718tickets/common';
import { Subjects } from '@jrk1718tickets/common';
export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  subject : Subjects.TicketCreated = Subjects.TicketCreated;
  //We need to provide the annotations because typescript may fear we willc ahnge tha value in future
  queueGroupName='payment-service';


  onMessage(data : TicketCreatedEvent['data'],msg : Message){
    console.log('Event data ',data);

     console.log(data.id);
     console.log(data.title);
     console.log(data.price);
     
    msg.ack();
  }
}


//If you don't understand watch the video from 305 to 310