import { User } from "../models/user.models.js";
import asyncHandler from "../utils/AyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { deleteImageFromCloudinary, uploadImageOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {

    let user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "user not found")
    }

    try {
        let accessToken = user.generateAccessToken()
        let refreshToken = user.generateRefreshToken()


        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        console.error("Token generation error:", error)
        throw new ApiError(500, 'error while generating access or refresh tokens')
    }
}

const register = asyncHandler(async (req, res) => {

    const { name, username, email, password } = req.body

    // Validate required fields
    if (!name || !username || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    // Check if user already exists
    let existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        throw new ApiError(400, "User already exists with this email or username")
    }

    // Handle avatar upload
    let avatarData = null;
    if (req.file && req.file.path) {
        try {
            const image = await uploadImageOnCloudinary(req.file.path)
            if (image && image.secure_url) {
                avatarData = {
                    secure_url: image.secure_url,
                    public_id: image.public_id
                }
            }
        } catch (error) {
            console.error("Error uploading avatar:", error)
            throw new ApiError(500, "Error uploading profile picture")
        }
    } else {
        throw new ApiError(400, "Profile picture is required")
    }

    // Create user
    const createUser = await User.create({
        name,
        username,
        email,
        password,
        avatar: avatarData
    })

    if (!createUser) {
        throw new ApiError(500, "User not created")
    }

    // Generate tokens for auto-login after registration
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(createUser._id)

    const options = {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000
    }

    let user = await User.findById(createUser._id).select("-password -refreshToken")

    res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(201, user, "User registered successfully")
        )


})

const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "user not found with this email id")
    }

    const isPasswordMatch = await user.isPasswordCorrect(password)
    if (!isPasswordMatch) {
        throw new ApiError(400, "wrong password")
    }

    const options = {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)

    const loginUser = await User.findById(user?._id).select("-password -refreshToken")

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, loginUser, " user login successfully")
        )


})

const logout = asyncHandler(async (req, res) => {

    const user = req?.myUser?._id

    await User.findOneAndUpdate(
        user?._id,
        {
            $unset: {
                refreshToken: 1
            }

        },
        { new: true }
    )


    res.status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
            new ApiResponse(200, "user logout success")
        )
})

const updatePhoto = asyncHandler(async (req, res) => {
    const userId = req.myUser?._id

    const imageLocalPath = req.file.path
    if (!imageLocalPath) {
        throw new ApiError(404, "no such image localPath found!")

    }
    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "user not found")

    }

    const deleteImage = await deleteImageFromCloudinary(user?.avatar?.public_id)


    if (!deleteImage) {
        throw new ApiError(500, "unable to delete image ")
    }

    const newImageUpload = await uploadImageOnCloudinary(imageLocalPath)

    if (!newImageUpload) {
        throw new ApiError(500, "error while uploading new image")
    }


    user.avatar = {
        secure_url: newImageUpload.secure_url,
        public_id: newImageUpload.public_id,
    }
    await user.save()


    res.status(200).json(
        new ApiResponse(200, { user }, "image updated successfully")
    )

})

const deletePhoto = asyncHandler(async (req, res) => {
    const userId = req?.myUser?._id

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const imageDeleted = await deleteImageFromCloudinary(user?.avatar?.public_id)

    if (!imageDeleted) {
        throw new ApiError(500, "unable to delete image")
    }

    res.status(200).json(
        new ApiResponse(200, "image deleted successfully")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "refresh token is required")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "user not found")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or invalid")
        }

        const options = {
            httpOnly: true,
            secure: false,
            maxAge: 15 * 60 * 1000
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, { accessToken, refreshToken }, "access token refreshed successfully")
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})

const currentUser = asyncHandler( async (req, res) => {
    const user = req.myUser

    res.status(200).json(
        new ApiResponse(200, user, "current user fetched successfully")
    )
})





export { register, login, logout, updatePhoto, deletePhoto, refreshAccessToken, currentUser }