import mongoose from 'mongoose';
import { Secret } from '../services/secret';
//Interface specifies the required properties to create a new user

interface UserCreds {
  email: string;
  password: string;
}

// Interace that specifies the properties of a User Model

interface UserModel extends mongoose.Model<UserDoc> {
  build(creds: UserCreds): UserDoc;
}

//Interface that specifies the properites of a User Document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Secret.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (creds: UserCreds) => {
  return new User(creds);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
