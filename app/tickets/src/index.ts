import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './natsWrapper';

const startTheServer = async () => {
  if (!process.env.BME_JWT_KEY) {
    throw new Error('BME_JWT_KEY must be defined');
  }
  
  if(!process.env.BME_MONGO_URI){
    throw new Error('BME_MONGO_URI must be defined');
  }

  if(!process.env.NATS_CLIENT_ID){
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if(!process.env.NATS_URL){
    throw new Error('NATS_URL must be defined');
  }
  if(!process.env.NATS_CLUSTER_ID){
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL)
    natsWrapper.client.on('close',()=>{
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT',()=> natsWrapper.client.close());
    process.on('SIGTERM',()=> natsWrapper.client.close());

    await mongoose.connect(process.env.BME_MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
};


startTheServer();

//Starting the server