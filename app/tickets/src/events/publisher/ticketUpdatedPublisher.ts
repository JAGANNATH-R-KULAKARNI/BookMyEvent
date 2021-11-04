import { Publisher,Subjects,TicketUpdatedEvent } from "@jrk1718tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject : Subjects.TicketUpdated=Subjects.TicketUpdated;
}