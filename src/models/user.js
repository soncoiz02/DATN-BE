import mongoose from 'mongoose';
import { createHmac } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      maxLength: 20,
    },
    name: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    phone: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    avt: {
      type: String,
    },
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods = {
  authenticate(password) {
    return this.password === this.encryptPassword(password);
  },
  encryptPassword(password) {
    if (!password) return;
    try {
      // eslint-disable-next-line consistent-return
      return createHmac('Sha256', 'abc').update(password).digest('hex');
    } catch (error) {
      console.log(error);
    }
  },
};

userSchema.pre('save', function (next) {
  try {
    this.password = this.encryptPassword(this.password);
    next();
  } catch (error) {
    console.log(error);
  }
});
export default mongoose.model('User', userSchema);
