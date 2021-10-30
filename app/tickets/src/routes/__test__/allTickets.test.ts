import request from 'supertest';
import { app } from '../../app';
import { fakeSignin as signin } from '../../test/setup';

const createATicket = () => {
  return request(app).post('/api/tickets').set('Cookie', signin()).send({
    title: 'jagannath event',
    price: 100,
  });
};

it('It should return the list of tickets', async () => {
  await createATicket();
  await createATicket();
  await createATicket();

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});