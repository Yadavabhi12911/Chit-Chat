import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.models.js"


const authenticate = async ( req, res , next) => {

    const token = req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", '')

    if(!token){
        throw new ApiError(401, "invalid token, please login first")
    }

    let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(401, "invalid signature , Please login again!")
    }

    req.myUser = user
    next()
}

export default authenticate
