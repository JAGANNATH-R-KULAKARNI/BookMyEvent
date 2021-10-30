import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';
import {fakeSignin as signin} from '../../test/setup';

it('It should return 404 error if ticket is not found',async ()=>{
  const id=new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('It should return a valid ticket if the ticket is found', async () => {
  const title = 'jagannath concert';
  const price = 30;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const Tresponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(Tresponse.body.title).toEqual(title);
  expect(Tresponse.body.price).toEqual(price);
});