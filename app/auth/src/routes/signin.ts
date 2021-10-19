import express,{Request,Response} from 'express';
import {body} from 'express-validator';
import jwt from 'jsonwebtoken';
import {User,createUser} from '../models/User';
import { EncryptPassword } from '../utilities/encryptPassword';
import { validateRequest } from '@jrk1718tickets/common';
import { BadRequestError } from '@jrk1718tickets/common';

const signinRoute=express.Router();

signinRoute.post('/api/users/signin',
[
  body('email').isEmail().withMessage('Email must be valid'),
       body('password')
         .trim()
         .notEmpty()
        .withMessage('You must supply a password'),
],
async (req :Request,res : Response)=>{
  const {email,password}=req.body;
  const existingUser=await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordsMatch = await EncryptPassword.compare(
    existingUser.password,
    password
  );

  if (!passwordsMatch) {
    throw new BadRequestError(`Invalid credentials`);
  }

  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    process.env.BME_JWT_KEY!
  );

  //Cookie is created, this particular cookie is handeled by the browser
  req.session = { jwt: userJwt };

  return res.status(200).send(existingUser);
});

export { signinRoute };