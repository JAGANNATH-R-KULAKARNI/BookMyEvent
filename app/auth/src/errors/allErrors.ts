import { ValidationError } from "express-validator";

export abstract class ErrorSuperClass extends Error{
  abstract HTTPStatusCode : number;

  constructor(message : string){
    super(message);
    Object.setPrototypeOf(this,ErrorSuperClass.prototype);
  }

  abstract errorMessage():{
    message : string;
    field?: string
  }[];
  //Abstract classes are mainly for inheritance where other classes may derive from them. We cannot create an instance of an abstract class.
}

export class BadRequestError extends ErrorSuperClass {
  HTTPStatusCode = 400;

  // (public message: string) this defines a varible names 'message' and assignes the value of string parameter to it
  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
    //Here we inherit the ErrorSuperClass object and assign it to BadRequestError object 
  }

  errorMessage() {
    return [{ message: this.message }];
  }
}

export class DatabaseConnectionError extends ErrorSuperClass{
  HTTPStatusCode=500;

  constructor(){
    super('There was an error connecting to database :(');

    Object.setPrototypeOf(this,DatabaseConnectionError.prototype);
  }

  errorMessage(){
    return [{message : 'There was an error connecting to database'}];
  }
}

export class UnAuthorizedError extends ErrorSuperClass{
  HTTPStatusCode=401;

  constructor(){
    super('You are Unauthorized');

    Object.setPrototypeOf(this,UnAuthorizedError.prototype);
  }

  errorMessage(){
    return [{message : 'You are Unauthorized'}];
  }
}

export class NotFoundError extends ErrorSuperClass{
  HTTPStatusCode=404;

  constructor(){
    super('Requested URL is not found :(');

    Object.setPrototypeOf(this,NotFoundError.prototype);
  }

  errorMessage(){
    return [{message : 'Requested URL is not found :('}];
  }
}

export class InvalidRequestError extends ErrorSuperClass{
  HTTPStatusCode=400;

  constructor(private errors : ValidationError[]){
    super('Invalid request');

    Object.setPrototypeOf(this,InvalidRequestError.prototype);
  }

  errorMessage(){
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}