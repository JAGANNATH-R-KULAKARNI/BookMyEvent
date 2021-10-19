import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo:any;

beforeAll(async ()=>{
  process.env.BME_JWT_KEY='jagannath'
  //Because Environmental variable is set only when it runs in POD . For testing purpose we will define it manually
 //Note that JWT key can be different everytime its ok

  mongo = await MongoMemoryServer.create();
  const mongoUri=await mongo.getUri();

  await mongoose.connect(mongoUri);
});

//Here we look at all the collections in DB and delete all the collections
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async ()=>{
  await mongo.stop();
  await mongoose.connection.close();
});

