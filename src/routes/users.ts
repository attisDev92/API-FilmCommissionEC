import { Router } from 'express'
import userControllers from '../controllers/userControllers'
import verifyToken from '../middlewares/verifyToken'
import verifyAdmin from '../middlewares/verifyAdmin'

const userRouter = Router()

userRouter.post('/create', userControllers.createUser)
userRouter.post('/login', userControllers.login)
userRouter.get('/login', verifyToken, userControllers.validateLogin)
userRouter.get('/auth/:code', userControllers.getUserFromEmailToken)
userRouter.post('/auth', userControllers.changevalidationUser)
userRouter.get('/', verifyToken, verifyAdmin, userControllers.getUsers)

export default userRouter
