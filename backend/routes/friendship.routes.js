
import { Router } from "express"

const router = Router()
import authenticate   from "../middlewares/authenticate.middleware.js"
import { acceptFriendRequest, getAllIncomingFriendRequest, getAllOutgoingFriendRequest, getFriendsList, rejectFriendRequest, sendFriendRequest, unfriend } from "../controllers/friendRequest.controllers.js"


router.post("/friend-request",authenticate, sendFriendRequest)
router.post("/friend-request/:id/accept", authenticate, acceptFriendRequest)
router.post("/friend-request/:id/reject", authenticate, rejectFriendRequest)

router.get("/friend-request/incoming", authenticate, getAllIncomingFriendRequest)
router.get("/friend-request/outgoing", authenticate, getAllOutgoingFriendRequest)

//freindship
router.get("/get-friend-list", authenticate, getFriendsList)
router.delete("/remove-friend/:friendId", authenticate, unfriend)

 
export default router
