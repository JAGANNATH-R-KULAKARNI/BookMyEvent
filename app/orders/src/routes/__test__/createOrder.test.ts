import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus} from '../../models/Order';
import { Ticket } from '../../models/Ticket';
import {fakeSignin} from '../../test/setup';
import {natsWrapper} from '../../natsWrapper';

it('should return an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', fakeSignin())
    .send({
      ticketId,
    })
    .expect(404);
});

it('should return an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'jagannath',
    price: 20,
  });

  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'someidvro',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', fakeSignin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('should reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'jagannath',
    price: 20,
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', fakeSignin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event',async ()=>{

  const ticket = Ticket.build({
    title: 'jagannath',
    price: 20,
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', fakeSignin())
    .send({ ticketId: ticket.id })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});