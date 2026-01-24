
import { Message } from "../models/message.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AyncHandler.js";

// Send a new message
export const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, content, expiredAt } = req.body;
    const senderId = req.myUser?._id;

    const message = await Message.create(
        {
            senderId,
            receiverId,
            content,
            expiredAt: new Date(expiredAt)

        });

    res.status(201).json(
        new ApiResponse(201, message, "Message sent successfully")
    );
});

// Fetch messages between two users
export const getMessages = asyncHandler(async (req, res) => {
    const senderId = req.myUser?._id;
    const { receiverId } = req.params;

    if (!receiverId) {
        return res.status(400).json(new ApiResponse(400, null, "Receiver ID is required."));
    }

    const messages = await Message.find({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
    }).sort({ createdAt: 1 });

    res.status(200).json(new ApiResponse(200, messages, "Messages retrieved"));
});


// Delete a message (typically sender or receiver can delete)
export const deleteMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.myUser?._id;

    const message = await Message.findOneAndDelete({
        _id: id,
        $or: [{ senderId: userId }, { receiverId: userId }]
    });

    if (!message) {
        return res.status(404).json(new ApiResponse(404, null, "Message not found or not authorized"));
    }

    res.status(200).json(new ApiResponse(200, null, "Message deleted"));
});