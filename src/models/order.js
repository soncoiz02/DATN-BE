import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const serviceSchema = new Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
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
    status: {
      type: ObjectId,
      ref: 'OrderStatus',
    },
    serviceId: {
      type: ObjectId,
      ref: 'Service',
    },
    userId: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', serviceSchema);
