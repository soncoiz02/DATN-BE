import mongoose, { Schema, ObjectId } from 'mongoose';

const billSchema = new Schema(
  {
    storeId: {
      type: ObjectId,
      ref: 'Store',
    },
    orderId: {
      type: ObjectId,
      ref: 'Order',
    },
    userId: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Bill', billSchema);
