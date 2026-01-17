import cookieParser from 'cookie-parser'
import express from 'express'
const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))




export default app