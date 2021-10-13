import request from 'supertest';
import { app } from '../../app';

it('should return a 201 status on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'jagannathrk@gmail.com',
      password: 'lolololol',
    })
    .expect(201);
});

it('should return a 400 status code when sent with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'jagannath',
      password: 'lllaalallalalkd',
    })
    .expect(400);
});

it('should return a 400 statuscode with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'jagannathrk@gmail.com',
      password: 'lol',
    })
    .expect(400);
});

it('should return a 400 statuscode with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'jagannathrk@gmail.com' })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'lolollaakalalla',
    })
    .expect(400);
});

it('should prevent signup through email more than once', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'jagannathrk@gmail.com',
      password: 'lololololol',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'jagannathrk@gmail.com',
      password: 'vamakalal'
    })
    .expect(400);
});

it('should set a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'jagannathrk@gmail.com',
      password: 'vamakalaaal'
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
  /*
   cookieSession({
    signed: false,
    secure: true, 
  })
  Using cookies for the session, if the cookies are "secure" then they won't get sent to the server unless it's https
  soo to pass the test set secure to 
   cookieSession({
    signed: false,
    secure: true, 
  })
  */
});