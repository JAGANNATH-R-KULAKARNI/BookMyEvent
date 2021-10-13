import request from 'supertest';
import { app } from '../../app';

it('should sent back user details',async ()=>{
const authResponse=await request(app)
.post('/api/users/signup')
.send({
  email : 'jagannathrk@gmail.com',
  password : 'akakakmslla'
})
.expect(201);

const cookie=authResponse.get('Set-Cookie');

const response=await request(app)
.get('/api/users/currentuser')
.set('Cookie',cookie)
.send()
.expect(200)

expect(response.body.currentUser.email).toEqual('jagannathrk@gmail.com');
});

it('need to get null as user in not authenticated',async ()=>{

   const response=await request(app)
   .get('/api/users/currentuser')
   .send()
   .expect(200)

   expect(response.body).toEqual({});
});
