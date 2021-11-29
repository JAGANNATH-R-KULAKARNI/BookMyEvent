import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';
import {fakeSignin} from '../../test/setup';

it('should fetch the order', async () => {
  const ticket = Ticket.build({
    title: 'jagannath',
    price: 20,
  });

  await ticket.save();

  const user = fakeSignin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('should return an error if one user tries to fetch another users order', async () => {
  const ticket = Ticket.build({
    title: 'jagannath',
    price: 20,
  });

  await ticket.save();

  const user = fakeSignin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie',fakeSignin())
    .send()
    .expect(401);
});