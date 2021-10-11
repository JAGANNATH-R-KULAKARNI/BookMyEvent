// const bcrypt=require('bcrypt');

// export class EncryptPassword{

//   static async encrypt(password: string) {
//       const hashedPassword = await bcrypt.hash(password, 10)
//       return hashedPassword;
//   }

//   static async compare(passwordStored: string, passwordUserEntered: string) {
//     const result= await bcrypt.compare(passwordStored, passwordUserEntered);
//     return result;
//   }
// }

import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
//(promisify)-> It is basically used to convert a method that returns 
//responses using a callback function to return responses in a promise object

export class EncryptPassword {
  static async encrypt(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer; //The buffers module provides a way of handling streams of binary data.
    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }
}