import { Publisher } from "@jrk1718tickets/common";
import { TicketCreatedEvent } from "@jrk1718tickets/common";
import { Subjects } from "@jrk1718tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject : Subjects.TicketCreated=Subjects.TicketCreated;
}