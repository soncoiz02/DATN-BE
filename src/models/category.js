import mongoose, { Schema, ObjectId } from 'mongoose';

const categoryService = new Schema(
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
categoryService.index({ '$**': 'text' });

export default mongoose.model('Category', categoryService);
