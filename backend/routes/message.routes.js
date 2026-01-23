import { Router } from 'express'

import authenticate from '../middlewares/authenticate.middleware.js'
import { getMessages, sendMessage } from '../controllers/message.controllers.js'

const router = Router()

router.post("/send-message", authenticate, sendMessage)
router.get("/get-messages/:id", authenticate, getMessages)
router.delete("/delete-message/:receiverId", authenticate, getMessages)


export default router