
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,

    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [8, "password must contains minimun 8 character"]
    },
    avatar: {
        type: Object
        
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true })


userSchema.index({ email: 1 });
userSchema.index({ username: 1 });


userSchema.pre('save', async function () {

    if (!this.isModified('password')) return 
    let salt = await bcrypt.genSalt(12)
    let hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword
})

userSchema.methods.isPasswordCorrect = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
       process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
    
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User", userSchema)

