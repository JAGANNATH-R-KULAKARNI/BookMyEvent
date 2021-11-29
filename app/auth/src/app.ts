import express from 'express';
import { json} from 'body-parser';
//Node.js body parsing middleware.
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
import 'express-async-errors';
//As we all know express sends a function called next into the middleware,
// which then needs to be called with or without error to make it move the request handling to the next middleware.
// It still works, but in case of an async function, you don't need to do that. If you want to pass an error, just throw a normal exception:
import cookieSession from 'cookie-session';
//A session cookie contains information that is stored in a temporary memory location 
//and then subsequently deleted after the session is completed or the web browser is closed. 
//This cookie stores information that the user has inputted and tracks the movements of the user within the website.
import { signupRoute} from './routes/signup';
import { signinRoute } from './routes/signin';
import {currentUserRoute} from './routes/currentuser';
import {signoutRoute} from './routes/signout';
import { NotFoundError } from '@jrk1718tickets/common';
import { errorHandler } from '@jrk1718tickets/common';

const port : number=3000;

const app=express();

app.set('trust proxy', true);
//By enabling the "trust proxy" setting via app.enable('trust proxy'), Express will have knowledge
// that it's sitting behind a proxy and that the X-Forwarded-* header fields may be trusted, which otherwise may be easily spoofed.

//In computer networking, a proxy server is a server application that acts as an intermediary between a client requesting a resource and the server providing that resource

app.use(json());
//A user session can be stored in two main ways with cookies: on the server or on the client. 
//This module stores the session data on the client within a cookie, while a module
// like express-session stores only a session identifier on the client within a cookie and stores the session data on the server,
// typically in a database.

//session object is turned into a string by cookieSession
//then cookieSession sends back to users browser
app.use(
  cookieSession({
    signed: false, //Its is not signed in initially
    secure: process.env.NODE_ENV !== 'test', //Using cookies for the session, if the cookies are "secure" then they won't get sent to the server unless it's https
    //If its a test environment secure will be false or else it will be true
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

export {app};