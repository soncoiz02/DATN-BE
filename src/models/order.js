import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const serviceSchema = new Schema(
  {
    dateStart: {
      type: String,
      required: true,
    },
    dateEnd: {
      type: String,
      required: true,
    },
    infoUser: {
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    orderStatus_id: {
      type: ObjectId,
      ref: 'OrderStatus',
    },
    service_id: {
      type: ObjectId,
      ref: 'Service',
    },
    user_id: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', serviceSchema);
