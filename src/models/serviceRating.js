import mongoose, { Schema } from "mongoose";

const serviceRating = new Schema({
    Name: {
        type: String,
        required: true
    },
    Feedback: {
        type: String,
        required: true

    },
    // User_id: {
    //     type: ObjectId,
    //     ref: "User",
    // },
    // Service_id: {
    //     type: ObjectId,
    //     ref: "Store",
    // },

}, { timestamps: true });

export default mongoose.model("ServiceRating", serviceRating);