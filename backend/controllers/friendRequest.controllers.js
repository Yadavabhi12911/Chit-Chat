
import mongoose from 'mongoose'
import { FriendRequest } from '../models/friendRequest.models.js'
import { Friendship } from '../models/friendship.models.js'
import { User } from '../models/user.models.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import ayncHandler from '../utils/AyncHandler.js'


const sendFriendRequest = ayncHandler(async (req, res) => {

    const senderId = req?.myUser?._id
    if (!senderId) {
        throw new ApiError(400, " sendId missing , please login again ")
    }

    const { receiverId } = req.body

    if (!receiverId) {
        throw new ApiError(400, "receiverId missing ")
    }

    const requestSender = await User.findById(senderId)
    if (!requestSender) {
        throw new ApiError(404, " RequestSender: user not found")
    }

    const requestReceiver = await User.findById(receiverId)
    if (!requestReceiver) {
        throw new ApiError(404, " RequestReceiver: user not found")
    }

    if (requestSender === requestReceiver) {
        throw new ApiError(400, "you cannot send request to yourself")
    }


    // already friend or not 
    const existingFriendship = await Friendship.findOne({
        senderId: requestSender,
        receiverId: requestReceiver

    })
    if (existingFriendship) {
        throw new ApiError(400, "already freind")
    }
    //  already friend request present or not 
    const existingFriendRequest = await Friendship.findOne({
        $or: [
            { senderId: requestSender, receiverId: requestReceiver },
            { receiverId: requestReceiver, senderId: requestSender }
        ]
    })

    if (existingFriendRequest) {
        throw new ApiError(400, "Friend request already pending")
    }

    const createFriendRequest = await FriendRequest.create({
        senderId: requestSender?._id,
        receiverId: requestReceiver?._id
    })


    res.status(201).json(
        new ApiResponse(201, createFriendRequest, "friend request created successfully")
    )



})

const acceptFriendRequest = asyncHandler(async (req, res) => {

    const currentUserId = req.myUser?._id
    const requestId = req.params?.id

    const session = mongoose.startSession()
    await session.startSession()

    try {

        const request = await FriendRequest.findById(requestId).session(session)
        if (!request) {
            throw new ApiError(404, "friend request not found")
        }

        if (request.receiverId !== currentUserId) {
            throw new ApiError(401, "unauthorised access to accept this request")
        }

        if (request.status !== 'pending') {
            throw new Error(409, "Friend request already processed");
        }

        function sortId(a, b){
         return a.toString() > b.toString() ? [a,b]  : [b,a]
        }

        const [ sender , receiver] = sortId(request.senderId, request.receiverId)

         await Friendship.create(
      [
        {
           senderId: sender,
          receiverId:receiver
        },
      ],
      { session }
    );

    } catch (error) {
 await session.abortTransaction();
    session.endSession();
    throw error;
    }
})



export { sendFriendRequest, acceptFriendRequest }