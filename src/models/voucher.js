import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const voucherSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    description: {
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
    isUsed: {
      type: Boolean,
      default: false,
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

voucherSchema.index({ '$**': 'text' });

export default mongoose.model('Voucher', voucherSchema);
