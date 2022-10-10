import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const staffSchema = new Schema(
  {
    staff: {
      type: ObjectId,
      ref: 'User',
    },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Staff', staffSchema);
