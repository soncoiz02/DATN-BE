import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const activityLogSchema = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    orderId: {
      type: ObjectId,
      ref: 'Order',
    },
    userId: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ActivityLog', activityLogSchema);
