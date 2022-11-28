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
      email: {
        type: String,
      },
    },
    status: {
      type: ObjectId,
      ref: 'OrderStatus',
      default: '632bc736dc2a7f68a3f383e7',
    },
    servicesRegistered: [
      {
        service: {
          type: ObjectId,
          ref: 'Service',
        },
        staff: {
          type: ObjectId,
          ref: 'Staff',
          default: null,
        },
        timeStart: {
          type: Date,
        },
        timeEnd: {
          type: Date,
        },
      },
    ],
    userId: {
      type: ObjectId,
      ref: 'User',
    },
    voucher: {
      type: ObjectId,
      ref: 'Voucher',
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', serviceSchema);
