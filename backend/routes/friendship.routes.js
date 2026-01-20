
import { Router } from "express"

const router = Router()
import authenticate   from "../middlewares/authenticate.middleware.js"
import { sendFriendRequest } from "../controllers/friendRequest.controllers.js"


router.post("/friend-request",authenticate, sendFriendRequest)




export default router
