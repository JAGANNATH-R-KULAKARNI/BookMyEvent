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
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await EncryptPassword.encrypt(this.get('password'));
    this.set('password', hashed);
  }
  done();
});


const User=mongoose.model('User',userSchema);

const createUser = (user : UserParameters)=>{
     return new User(user);
}

export { User,createUser };