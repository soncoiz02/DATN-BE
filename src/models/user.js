import mongoose from 'mongoose';
import { createHmac } from 'crypto';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avt: {
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
