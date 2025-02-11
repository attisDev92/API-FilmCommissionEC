import { Router } from 'express'
import verifyToken from '../middlewares/verifyToken'

const locationsRouter = Router()

locationsRouter.post('/', verifyToken)
locationsRouter.get('/')

export default locationsRouter
