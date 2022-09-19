import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const serviceStepSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    service_id: {
      type: ObjectId,
      ref: 'Service',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ServiceStep', serviceStepSchema);
