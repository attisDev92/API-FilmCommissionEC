import { Router } from 'express'
import userControllers from '../controllers/userControllers'
import verifyToken from '../middlewares/verifyToken'
import verifyAdmin from '../middlewares/verifyAdmin'

const userRouter = Router()

userRouter.post('/', userControllers.createUser)
userRouter.get('/auth/:code', userControllers.getUserFromEmailToken)
userRouter.post('/auth', userControllers.changevalidationUser)
userRouter.post('/login', userControllers.login)
userRouter.get('/login', verifyToken, userControllers.validateLogin)
userRouter.get('/', verifyToken, verifyAdmin, userControllers.getUsers)

export default userRouter
