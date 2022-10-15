import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const activityLogSchema = new Schema({
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
});

export default mongoose.model('ActivityLog', activityLogSchema);
