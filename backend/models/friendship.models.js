import mongoose, { Schema} from "mongoose";

const friendshipSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);


friendshipSchema.index(
  { sendId: 1, receiverId: 1 },
  { unique: true }
);

export const Friendship = mongoose.model("Friendship", friendshipSchema);
