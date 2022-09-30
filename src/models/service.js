import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    totalStaff: {
      type: Number,
      default: 0,
    },
    timeSlot: {
      type: Array,
    },
    categoryId: {
      type: ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true }
);

serviceSchema.index({ '$**': 'text' });

export default mongoose.model('Service', serviceSchema);
