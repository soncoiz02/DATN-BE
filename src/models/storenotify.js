import mongoose, { Schema, ObjectId } from 'mongoose';

const storeNotifySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
    },
    storeId: {
      type: ObjectId,
      ref: 'Store',
    },
  },
  { timestamps: true }
);

export default mongoose.model('StoreNotify', storeNotifySchema);
