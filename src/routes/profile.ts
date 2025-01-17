import { Router } from 'express'
import verifyToken from '../middlewares/verifyToken'
import profileControllers from '../controllers/profileControllers'

const profileRouter = Router()

profileRouter.get('/', verifyToken, profileControllers.getProfile)
profileRouter.post('/', verifyToken, profileControllers.postProfile)

export default profileRouter
