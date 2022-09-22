import mongoose, { Schema, ObjectId } from 'mongoose';

const storeRating = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    storeId: {
      type: ObjectId,
      ref: 'Store',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('StoreRating', storeRating);
