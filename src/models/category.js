import mongoose, { Schema, ObjectId } from 'mongoose';

const categoryServiece = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    storeId: {
      type: ObjectId,
      ref: 'Store',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categoryServiece);
