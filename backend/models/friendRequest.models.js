
import mongoose, { Schema } from 'mongoose'

const friendRequestSchema = new Schema({
    senderId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    status:{
        type: String,
        enum:["pending", "accepted", "rejected"],
        default:"pending"

    }
}, {timestamps: true})


friendRequestSchema.index(
    {senderId: 1 , receiverId:1},
    { unique: true}
)


export const Friendrequest = model("Friendrequest", friendRequestSchema)