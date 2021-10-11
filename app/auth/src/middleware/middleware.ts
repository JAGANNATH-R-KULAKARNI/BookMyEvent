import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ErrorSuperClass,InvalidRequestError ,UnAuthorizedError} from '../errors/allErrors';

export const validateRequest = (req : Request,res : Response,next : NextFunction)=>{

  const errors=validationResult(req);

   //if error happens throw the error
  if(!errors.isEmpty()){
    throw new InvalidRequestError(errors.array());
  }

  next();
  //Next is used to pass control to the next middleware function. If not the request will be left hanging or open.
}

// export const requireAuthorization = (req :Request,res : Response , next : NextFunction)=>{
//   if(!req.currentUser){
//     throw new UnAuthorizedError();
//   }

//   next();
// };

export const errorHandler = (err :Error,req :Request,res : Response,next : NextFunction)=>{

  if(err instanceof ErrorSuperClass){
    return res.status(err.HTTPStatusCode).send({errors : err.errorMessage()});
  }

  return res.status(400).send({
    errors : [{message : 'Something went wrong :('}]
  });
};

import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

//This concept is known as 'Declaration Merging'
declare global {   //'declare global' is used inside a file that has import or export to declare things in the global scope
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
//Now 'currentUser' is globally declared so that typescript won;t show error

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.jwt) {  //If no cookie or jsonwebtoken is present return as user is not authorized
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.BME_JWT_KEY!
    ) as UserPayload;
    //If user is verified ,payload will have user info value and we set that to 'req.currentUser'
    //OR it will throw error 
    req.currentUser = payload;
  } catch (err) {
    
  }

  next();
};