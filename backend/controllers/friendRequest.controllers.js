
import mongoose from 'mongoose'
import { FriendRequest } from '../models/friendRequest.models.js'
import { Friendship } from '../models/friendship.models.js'
import { User } from '../models/user.models.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/AyncHandler.js'


const sendFriendRequest = asyncHandler(async (req, res) => {

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


    if (requestSender._id.toString() === requestReceiver._id.toString()) {
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

    const session = await mongoose.startSession();
    session.startTransaction()

    try {

        const request = await FriendRequest.findById(requestId).session(session)
        if (!request) {
            throw new ApiError(404, "friend request not found")
        }

        if (request.receiverId.toString() !== currentUserId.toString()) {
            throw new ApiError(401, "unauthorised access to accept this request")
        }

        if (request.status !== 'pending') {
            throw new ApiError(409, "Friend request already processed");
        }


        function sortId(a, b) {
            return a.toString() < b.toString() ? [a, b] : [b, a]
        }

        const [sender, receiver] = sortId(request.senderId, request.receiverId)



        const createFriendShip = await Friendship.create(
            [
                {
                    senderId: sender,
                    receiverId: receiver
                },
            ],
            { session }
        );

        await FriendRequest.deleteOne({ _id: request._id }).session(session)
        await session.commitTransaction()
        session.endSession()


        res.status(200).json(
            new ApiResponse(200, createFriendShip, "friend request accepted successfully")
        )

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
})

const rejectFriendRequest = asyncHandler(async (req, res) => {

    const currentuserId = req.myUser?._id
    const requestId = req.params.id

    if (!requestId) {
        throw new ApiError(404, "friend id not found")
    }

    try {

        const existingRequest = await FriendRequest.findById(requestId)

        if (!existingRequest) {
            throw new ApiError(404, "no friend request found")
        }


        if (existingRequest.receiverId.toString() !== currentuserId.toString()) {
            throw new ApiError(401, "not authorizef to reject this request")
        }

        const deleteRequest = await FriendRequest.findByIdAndDelete(existingRequest._id)

        res.status(200).json(
            new ApiResponse(200, deleteRequest, "friend request delete successfully")
        )
    } catch (error) {
        console.log("err while deleling friend request ", error);
        throw new ApiError(500, "error occur while rejecting friend request")
    }
})

const getAllIncomingFriendRequest = asyncHandler(async (req, res) => {
    const userId = req.myUser?._id

    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "user not found")
        }

        const incomingRequests = await FriendRequest.find(
            {
                receiverId: user?._id,
                status: "pending",
            }
        ).populate("receiverId senderId", "username name").sort({ createdAt: -1 });

        if (!incomingRequests) {
            throw new ApiError(404, " no friend requests found")
        }

        res.status(200).json(
            new ApiResponse(200, incomingRequests, "all incoming friend requests fetched successfully")
        )

    } catch (error) {
        console.log("unable to find incoming friend requests", error);

        throw new ApiError(500, "error while finding incoming friend requests")

    }
})

const getAllOutgoingFriendRequest = asyncHandler(async (req, res) => {
    const userId = req?.myUser?._id

    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "user not found")
        }

        const outgoingRequests = await FriendRequest.find(
            {
                senderId: user?._id,
                status: "pending"
            }
        ).populate("senderId receiverId", "username name").sort({ createdAt: -1 })

        if (!outgoingRequests) {
            throw new ApiError(404, "no outgoing friend request found")
        }
        res.status(200).json(
            new ApiResponse(200, outgoingRequests, "successfully fetched all outgoing friend requests")
        )
    } catch (error) {
        console.log("err while fetching all outgoing friend requests", error);
        throw new ApiError(500, "unable to fetch outgoing friend requests")

    }
})

const getFriendsList = asyncHandler(async (req, res) => {
    const userId = req?.myUser?._id
    try {
        const user = await User.findById(userId)
        if (!userId) {
            throw new ApiError(404, "user not found")
        }

        const friendsList = await Friendship.find(
            {
                $or: [
                    { senderId: user?._id },
                    { receiverId: user?._id }
                ]
            }
        ).populate("senderId receiverId", "name  username").sort({ createdAt: -1 })

        if (!friendsList) {
            throw new ApiError(404, "no friends founds")
        }
        res.status(200).json(
            new ApiResponse(200, friendsList, "successfully fetched friend list")
        )
    } catch (error) {
        console.log("error while fetching all frind list ", error);
        throw new ApiError(500, "unable to fetch frind list")

    }

})

const unfriend = asyncHandler(async (req, res) => {
    const currentUserId = req?.myUser?._id
    const friendId = req.params.friendId

    if (!friendId) {
        throw new ApiError(404, "friendId not found")
    }

    function sortId(a, b) {
        return a.toString() < b.toString() ? [a, b] : [b, a]
    }
 
    const [friend1 , friend2] = sortId(currentUserId, friendId)

    try {
        const removeFriend = await Friendship.deleteOne(
            {
                senderId:friend1, 
                receiverId:friend2
            }
        )

        if(!removeFriend){
            throw new ApiError(400, "remove friend failed")
        }

        res.status(200).json(
            new ApiResponse(200, "remove friend Success")
        )
        
    } catch (error) {
        console.log("err while removing friend", error);
        throw new ApiError(500, "unable to remove friend from friendList")
        
    }


})



export { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getAllIncomingFriendRequest, getAllOutgoingFriendRequest, getFriendsList, unfriend }
