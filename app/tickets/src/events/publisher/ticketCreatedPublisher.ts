import { Publisher,Subjects,TicketCreatedEvent } from "@jrk1718tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject : Subjects.TicketCreated=Subjects.TicketCreated;
}