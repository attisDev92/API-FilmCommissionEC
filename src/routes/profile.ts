import { Router } from 'express'
import verifyToken from '../middlewares/verifyToken'

const profileRouter = Router()

profileRouter.post('/', verifyToken)
profileRouter.get('/:id', verifyToken)
profileRouter.get('/', verifyToken)
