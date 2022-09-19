import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Types;

const serviceSchema = new Schema({
    dateStart: {
        type: Date,
        required: true
    },
    infoUser: {
        type: String,
        required: true

    },
    status: {
        type: Number,
        required: true

    },
    user_id: {
        type: ObjectId,
        ref: "User",

    },
    service_id: {
        type: ObjectId,
        ref: "Service",
    },


}, { timestamps: true });

export default mongoose.model("Order", serviceSchema);