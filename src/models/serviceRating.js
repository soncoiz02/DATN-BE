import mongoose, { Schema, ObjectId } from 'mongoose';

const serviceRating = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
    },
    serviceId: {
      type: ObjectId,
      ref: 'Store',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ServiceRating', serviceRating);
