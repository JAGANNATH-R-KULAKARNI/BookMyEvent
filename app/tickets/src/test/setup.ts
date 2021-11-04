import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// declare global {
//   namespace NodeJS {
//     interface Global {
//       signin(): string[];
//     }
//   }
// }
jest.mock('../natsWrapper.ts');
let mongo: any;

beforeAll(async () => {
  process.env.BME_JWT_KEY = 'jagannath';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();//We need to reset the data everytime
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

const fakeSignin= () => {
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

export {fakeSignin};