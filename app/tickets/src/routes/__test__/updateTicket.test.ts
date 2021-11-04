import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import {fakeSignin as signin} from '../../test/setup';
import {natsWrapper} from '../../natsWrapper';

it('It should return a 404 error if the provided id does not exist', async () => {
  
  const id=new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'jagannath event',
      price: 30,
    })
    .expect(404);
});

it('It should return 401 error if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'jagannath event',
      price: 30,
    })
    .expect(401);
});

it('It should return a 401 error if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'jagannath event',
      price: 30,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({
      title: 'benedict event',
      price: 40,
    })
    .expect(401);

    //here we are signing in with different ids 
});

it('It should return 400 error if the user provides an invalid title or price', async () => {
  const cookie =signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'jagannath concert',
      price: 40,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 30,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'jagannath event',
      price: -10
    })
    .expect(400);
});

it('It should updates the ticket if provided valid input', async () => {
  const cookie = signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'jagannath event',
      price: 30,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'benedict concert',
      price: 40,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('benedict concert');
  expect(ticketResponse.body.price).toEqual(40);
});

it('It publishes an event',async ()=>{
  const cookie = signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'jagannath event',
      price: 30,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'benedict concert',
      price: 40,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('benedict concert');
  expect(ticketResponse.body.price).toEqual(40);
   expect(natsWrapper.client.publish).toHaveBeenCalled();
});