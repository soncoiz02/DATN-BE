import mongoose, { Schema, ObjectId } from "mongoose";

const serviceRating = new Schema({
    content: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true

    },
    userId: {
        type: ObjectId,
        ref: "User",
    },
    serviceId: {
        type: ObjectId,
        ref: "Service",
    },

}, { timestamps: true });

export default mongoose.model("ServiceRating", serviceRating);