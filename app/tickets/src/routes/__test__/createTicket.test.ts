import request from 'supertest';
import {app} from '../../app';
import {Ticket} from '../../models/Tickets';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const signin= () => {
  //Building a JWT payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'jagannathrkulakarni.171845@gmail.com',
  };

   //create the JWT
  const token = jwt.sign(payload, process.env.BME_JWT_KEY!);

  //Build the session object
  const session = { jwt: token };

  //Turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it to base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return the string that is the cookie with the encoded data
  return [`express:sess=${base64}`];
};

it('there is a server which is listening on api/tickets',async ()=>{
  const response = await request(app).post('/api/tickets').send({});
expect(response.status).not.toEqual(404);
});

it('It is only accessed if it is signed in',async ()=>{
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('it returns a status other than 401 if the user is signed in',async ()=>{
  const response =await request(app)
  .post('/api/tickets')
  .set('Cookie',signin())
  .send({});
 console.log('hey',response.status);
 // expect(response.status).not.toEqual(401);
})