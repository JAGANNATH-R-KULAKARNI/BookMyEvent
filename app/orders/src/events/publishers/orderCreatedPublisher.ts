import { Publisher,OrderCreatedEvent,Subjects } from "@jrk1718tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject : Subjects.OrderCreated=Subjects.OrderCreated;
}

