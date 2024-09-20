import { Router, Request, Response } from 'express'
import { createNewUser, getAllUsers } from '../services/usersServices'
import { IErrorMessage, IUser } from '../types'

const userRouter = Router()

userRouter.post(
  '/',
  async (req: Request, res: Response): Promise<void | Response> => {
    const body = req.body as Omit<IUser, 'id'>
    try {
      const newUser = await createNewUser(body)

      if ((newUser as IErrorMessage).error) {
        const errorResponse = newUser as IErrorMessage
        return res
          .status(errorResponse.status || 400)
          .json({ error: errorResponse.error })
      }
      res.status(201).json(newUser as IUser)
    } catch (error) {
      res.status(500).json({ error: 'error al crear el usuario' })
    }
  },
)

userRouter.post(
  '/login',
  async (req: Request, res: Response): Promise<void | Response> => {
    const body = req.body as Pick<IUser, 'email' | 'password'>
    console.log(body)
    try {
      res.status(200)
    } catch (error) {
      console.log(error)
      res.status(500)
    }
  },
)

userRouter.get(
  '/',
  async (_req: Request, res: Response): Promise<void | Response> => {
    try {
      const users = await getAllUsers()

      if ((users as IErrorMessage).error) {
        const errorResponse = users as IErrorMessage
        return res
          .status(errorResponse.status || 500)
          .json({ error: errorResponse.error })
      }
      res.status(200).json(users as IUser[])
    } catch (error) {
      res.status(500).json({ error: 'error al obtener los usuarios' })
    }
  },
)

export default userRouter
