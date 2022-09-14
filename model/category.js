import mongoose, { Schema, ObjectId, } from "mongoose";

const categoryServiece = new Schema({
    name: {
        type: String,
        required: true
    },
}, { timestamps: true })

export default mongoose.model("Category", categoryServiece)