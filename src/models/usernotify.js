import mongoose, { Schema, ObjectId } from 'mongoose';

const userNotifySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
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

export default mongoose.model('UserNotify', userNotifySchema);
