import express, { application } from 'express';
import { json} from 'body-parser';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { signupRoute} from './routes/signup';
import { NotFoundError } from './errors/allErrors';
import { errorHandler } from './middleware/middleware';

const port : number=3000;

const app=express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(signupRoute);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const startTheServer = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
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