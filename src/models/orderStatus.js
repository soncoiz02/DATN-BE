import mongoose, { Schema } from 'mongoose';

const orderStatus = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('OrderStatus', orderStatus);
