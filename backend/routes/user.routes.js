
import { Router} from 'express'
import { login, logout, register } from '../controllers/user.controllers.js'
import authenticate from '../middlewares/authenticate.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

router.post("/register", upload.single('avatar'), register)
router.post("/login", login)


router.post("/logout",authenticate, logout)


export default router


