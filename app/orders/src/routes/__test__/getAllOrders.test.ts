import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';
import {fakeSignin} from '../../test/setup';

const buildTheTicket = async () => {
  const ticket = Ticket.build({
    title: 'jagannath',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

it('It should fetch orders for an particular user', async () => {
  const ticketOne = await buildTheTicket();
  const ticketTwo = await buildTheTicket();
  const ticketThree = await buildTheTicket();

  const userOne = fakeSignin();
  const userTwo = fakeSignin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: ticketThree.id,
    })
    .expect(201);

    const response1 = await request(app)
    .get('/api/orders')
    .set('Cookie', userOne)
    .expect(200);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);


  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});