import mongoose, { Schema } from "mongoose";
// const { ObjectId } = mongoose.Types;

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200,
    },
    description: {
        type: String,

    },
    // system_id: {
    //     type: ObjectId,
    //     ref: "System",
    //     required: true
    // },

}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);