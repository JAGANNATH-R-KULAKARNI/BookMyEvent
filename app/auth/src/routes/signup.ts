import express, { Request, Response } from 'express';
import { body } from 'express-validator';
// Express Validator is a set of Express. js middleware that wraps validator. js , a library that provides validator and sanitizer functions. 
//Simply said, Express Validator is an Express middleware library that you can incorporate in your apps for server-side data validation
import jwt from 'jsonwebtoken';
//JWT, or JSON Web Token, is an open standard used to share security information between two parties — a client and a server.
// Each JWT contains encoded JSON objects, including a set of claims. JWTs are signed using a cryptographic algorithm to ensure that the claims cannot be altered after the token is issued.
import { BadRequestError,InvalidRequestError } from '@jrk1718tickets/common';
import { validateRequest } from '@jrk1718tickets/common';
import { User,createUser} from '../models/User';

const signupRoute = express.Router();

signupRoute.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      throw new BadRequestError('This Email is already taken');
    }

    const user = createUser({
      email,
      password,
    });

    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.BME_JWT_KEY!
    );

    req.session = { jwt: userJwt };

    return res.status(201).send(user);
  }
);

export { signupRoute };