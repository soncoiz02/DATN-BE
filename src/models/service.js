import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Types;

const serviceSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Desc: {
        type: String,
        required: true

    },
    Price: {
        type: Number,
        required: true

    },
    Image: {
        type: String,
        required: true

    },
    Duration: {
        type: Number,
        required: true

    },
    Status: {
        type: Number,
        required: true
    },
    Store_id: {
        type: ObjectId,
        ref: "Store",
    },

}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);