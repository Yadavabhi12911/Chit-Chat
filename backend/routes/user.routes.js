import { Router} from 'express'
import { deletePhoto, login, logout, register, updatePhoto, refreshAccessToken, currentUser } from '../controllers/user.controllers.js'
import authenticate from '../middlewares/authenticate.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

router.post("/register", upload.single('avatar'), register)
router.post("/login", login)

router.get("/me",authenticate, currentUser)

router.post("/logout",authenticate, logout)
router.post("/update-profile-photo",upload.single("newImage"), authenticate, updatePhoto)
router.post("/delete-profile-photo", authenticate, deletePhoto)
router.post('/refresh-token', refreshAccessToken)

export default router




