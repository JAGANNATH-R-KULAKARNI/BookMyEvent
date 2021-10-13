import mongoose from 'mongoose';
import { app } from './app';

const startTheServer = async () => {
  if (!process.env.BME_JWT_KEY) {
    throw new Error('BME_JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-svc:27017/auth');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
};


startTheServer();