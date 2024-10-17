import { Router } from 'express'
import userControllers from '../controllers/userControllers'
import verifyToken from '../middlewares/verifyToken'

const userRouter = Router()

userRouter.post('/', userControllers.createUser)
userRouter.get('/auth/:code', userControllers.getUserFromEmailToken)
userRouter.post('/auth', userControllers.changevalidationUser)
userRouter.post('/login', userControllers.login)
userRouter.get('/login', verifyToken, userControllers.validateLogin)
userRouter.get('/', verifyToken, userControllers.getUsers)

export default userRouter
