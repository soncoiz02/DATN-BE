import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const serviceSchema = new Schema(
  {
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
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
    orderStatus: {
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
