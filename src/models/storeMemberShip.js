import mongoose, { Schema, ObjectId } from "mongoose";

const storeMemberShip = new Schema({
    userId: {
        type: ObjectId,
        ref: "User",
    },
    serviceId: {
        type: ObjectId,
        ref: "Store",
    },

}, { timestamps: true });

export default mongoose.model("StoreMemberShip", storeMemberShip);