import mongoose, { Schema, ObjectId } from 'mongoose';

const postCommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
    },
    postId: {
      type: ObjectId,
      ref: 'Post',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Postcomment', postCommentSchema);
