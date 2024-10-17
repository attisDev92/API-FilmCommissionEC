import { Router } from 'express'
import userControllers from '../controllers/userControllers'

const userRouter = Router()

userRouter.post('/', userControllers.createUser)
userRouter.get('/auth/:code', userControllers.getUserFromEmailToken)
userRouter.post('/auth', userControllers.changevalidationUser)
userRouter.post('/login', userControllers.login)
userRouter.get('/', userControllers.getUsers)

export default userRouter
