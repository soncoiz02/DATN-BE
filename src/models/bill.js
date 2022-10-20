import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const billSchema = new Schema(
  {
    order: {
      type: ObjectId,
      ref: 'Order',
    },
    store: {
      type: ObjectId,
      ref: 'Store',
    },
    user: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Bill', billSchema);
