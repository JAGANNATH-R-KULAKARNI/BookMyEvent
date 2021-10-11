import mongoose from 'mongoose';
import {EncryptPassword} from '../utilities/encryptPassword';

interface UserParameters {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {                           //This function is an inbuild function used to set some return values 
      transform(doc, ret) {
        ret.id = ret._id;                         //In only MongoDB we have _id property in other database we have id , do for uniformity we are doing this
        delete ret._id;                          //we are here deleting _id,password,_v variables if u carefully look
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

//Before the document is stored this function always runs
//'done' function is used to move from the middlware if async function is used
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await EncryptPassword.encrypt(this.get('password'));
    this.set('password', hashed);
  }
  done();
});


const User=mongoose.model('User',userSchema);

//to prevent certain errors I am using this function , as typecheck is done before storing the user info
const createUser = (user : UserParameters)=>{
     return new User(user);
}

export { User,createUser };