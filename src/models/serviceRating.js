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
    // user_id: {
    //     type: ObjectId,
    //     ref: "User",
    // },
    service_id: {
        type: ObjectId,
        ref: "Store",
    },

}, { timestamps: true });

export default mongoose.model("ServiceRating", serviceRating);