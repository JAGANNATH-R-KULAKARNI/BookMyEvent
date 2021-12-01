import { Publisher,Subjects,OrderCancelledEvent } from "@jrk1718tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{

  subject : Subjects.OrderCancelled=Subjects.OrderCancelled;
}