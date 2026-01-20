
import mongoose, { model, Schema } from "mongoose";

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        maxlength: [2000, " message length limit exceed !"]
    },
    readAt: {
        type: Date,
        default: null,
        index: true,

    },
    expiredAt: {
        type: Date,
        required: true,
        
    }
}, { timestamps: true })

messageSchema.index(
    { expiredAt: 1 },
    { expireAfterSeconds: 0 }

)

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 })


export const Message = model("Message", messageSchema)


