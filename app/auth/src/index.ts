import express from 'express';
import { json} from 'body-parser';
//Node.js body parsing middleware.
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
import 'express-async-errors';
//As we all know express sends a function called next into the middleware,
// which then needs to be called with or without error to make it move the request handling to the next middleware. It still works, but in case of an async function, you don't need to do that. If you want to pass an error, just throw a normal exception:
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
//A session cookie contains information that is stored in a temporary memory location 
//and then subsequently deleted after the session is completed or the web browser is closed. 
//This cookie stores information that the user has inputted and tracks the movements of the user within the website.
import { signupRoute} from './routes/signup';
import { signinRoute } from './routes/signin';
import {currentUserRoute} from './routes/currentuser';
import {signoutRoute} from './routes/signout';
import { NotFoundError } from './errors/allErrors';
import { errorHandler } from './middleware/middleware';

const port : number=3000;

const app=express();

app.set('trust proxy', true);
//By enabling the "trust proxy" setting via app.enable('trust proxy'), Express will have knowledge
// that it's sitting behind a proxy and that the X-Forwarded-* header fields may be trusted, which otherwise may be easily spoofed.
app.use(json());
app.use(
  cookieSession({
    signed: false, //Its is not signed in initially
    secure: true, //Using cookies for the session, if the cookies are "secure" then they won't get sent to the server unless it's https
  })
);

app.use(signupRoute);
app.use(signinRoute);
app.use(currentUserRoute);
app.use(signoutRoute);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

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