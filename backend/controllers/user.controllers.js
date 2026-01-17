import { User } from "../models/user.models.js";
import asyncHandler from "../utils/AyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { uploadImageOnCloudinary } from "../utils/cloudinary.js";

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

    const { name, username, email, password, avatar } = req.body

         let imageLocalPath = req.file.path
        if(!imageLocalPath) throw new ApiError(404, "no such image localPath found!")

    let existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        throw new ApiError(400, "user already exist")
    }

    const image =  await uploadImageOnCloudinary(imageLocalPath)


console.log(" image res --> ", image);

    const createUser = await User.create({
        name,
        username,
        email,
        password,
        avatar: {
            secure_url : image.secure_url,
            public_id: image.public_id
        }
    })

    if (!createUser) {
        throw new ApiError(false, 500, "user not created")
    }

    let user = await User.findOne({ email }).select("-password -refreshToken")

    res.status(201).json(
        new ApiResponse(201, user, "user register successfully")
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



export { register, login, logout }