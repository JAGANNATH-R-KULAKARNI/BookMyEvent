import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ErrorSuperClass,InvalidRequestError ,UnAuthorizedError} from '../errors/allErrors';

export const validateRequest = (req : Request,res : Response,next : NextFunction)=>{

  const errors=validationResult(req);

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