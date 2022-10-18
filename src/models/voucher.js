import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const voucherSchema = new Schema(
  {
    discount: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usedIs: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
    },
    storeId: {
      type: ObjectId,
      ref: 'Store',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Voucher', voucherSchema);
