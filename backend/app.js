import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
const app = express()

app.use(cors({
    origin:"*"
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))


import userRouter from './routes/user.routes.js'
import frinedshipRouter from "./routes/friendship.routes.js"
import messageRouter from './routes/message.routes.js'
import error from './middlewares/error.middleware.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/friendship", frinedshipRouter)
app.use("/api/v1/messages", messageRouter)





app.use(error)

export default app
