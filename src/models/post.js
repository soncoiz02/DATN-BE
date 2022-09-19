import mongoose, { Schema, ObjectId } from 'mongoose';

const postSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    user_id: {
      type: ObjectId,
      ref: 'User',
    },
    store_id: {
      type: ObjectId,
      ref: 'Store',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
