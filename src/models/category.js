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
    storeId: {
      type: ObjectId,
      ref: 'Store',
    },
  },
  { timestamps: true }
);

categoryServiece.index({ '$**': 'text' });

export default mongoose.model('Category', categoryServiece);
