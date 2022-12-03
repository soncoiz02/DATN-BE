import mongoose, { Schema, ObjectId } from 'mongoose';

const categoryServiece = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    status: {
      type: Number,
      required: true,
      default: 0,
    },
    storeId: {
      type: ObjectId,
      ref: 'Store',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categoryServiece);
