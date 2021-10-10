import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError,InvalidRequestError } from '../errors/allErrors';
import { validateRequest } from '../middleware/middleware';
import { User,createUser} from '../models/User';

const router = express.Router();

router.post(
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

    console.log('here lollll')
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

export { router as signupRoute };