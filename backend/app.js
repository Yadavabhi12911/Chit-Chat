import cookieParser from 'cookie-parser'
import express from 'express'
const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))


import userRouter from './routes/user.routes.js'
import error from './middlewares/error.middleware.js'

app.use("/users/v1", userRouter)





app.use(error)

export default app