import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';
import {fakeSignin as signin} from '../../test/setup';

it('server listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('user must be signed in to access it', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('It should return a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('It should return an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: '',
      price: 100,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie',signin())
    .send({
      price: 100,
    })
    .expect(400);
});

it('It should return an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'jagannath event',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'jagannath event',
    })
    .expect(400);
});

it('It should create a ticket if valid inputs are provided', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'jagannath event';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title,
      price: 100,
    })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(100);
  expect(tickets[0].title).toEqual(title);
});