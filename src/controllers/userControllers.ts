import { Response, Request } from 'express'
import {
  AuthenticatedRequest,
  IUser,
  IUserLoginPayload,
} from '../types/userTypes'
import {
  createNewUser,
  loginUser,
  getAllUsers,
  validateEmailUser,
  sendValidationUserCode,
  validateUser,
} from '../services/usersServices'
import { HttpResponse } from '../shared/HttpResponse'
import { CustomError, ErrorsMessage } from '../shared/CustomError'
import mongoose from 'mongoose'

const httpResponse = new HttpResponse()

const createUser = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  try {
    const body = req.body
    const newUser = await createNewUser(body)
    await sendValidationUserCode(newUser)
    return httpResponse.CREATED(res, newUser)
  } catch (error: any) {
    console.error(error)
    if (
      error instanceof CustomError &&
      error.message === ErrorsMessage.USER_EXIST
    ) {
      return httpResponse.BAD_REQUEST(res, error.message)
    }
    if (error instanceof mongoose.Error && error.name === 'ValidationError') {
      return httpResponse.BAD_REQUEST(res, ErrorsMessage.INVALID_DATA)
    }
    return httpResponse.ERROR(res, error.message)
  }
}

const getUserFromEmailToken = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const { params } = req
  try {
    await validateEmailUser(params.code)
    httpResponse.ACCEPTED(res)
  } catch (error: any) {
    if (
      error.name === 'JsonWebTokenError' ||
      (error instanceof CustomError &&
        error.message === 'El recurso al que intenta acceder no existe')
    ) {
      return httpResponse.BAD_REQUEST(res, ErrorsMessage.NOT_EXIST)
    }

    return httpResponse.ERROR(res, error.message)
  }
}

const changevalidationUser = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const name = req.body
  try {
    const user = await validateUser(name)
    httpResponse.ACCEPTED(res, user)
  } catch (error: any) {
    if (
      error instanceof CustomError &&
      error.message === 'El recurso al que intenta acceder no existe'
    ) {
      return httpResponse.BAD_REQUEST(res, ErrorsMessage.NOT_EXIST)
    }

    return httpResponse.ERROR(res, error.message)
  }
}

const login = async (req: Request, res: Response): Promise<void | Response> => {
  const { email, password } = req.body as Pick<IUser, 'email' | 'password'>
  try {
    const userToken: IUserLoginPayload = await loginUser({
      email,
      password,
    })

    return httpResponse.ACCEPTED(res, userToken)
  } catch (error: any) {
    if (
      error instanceof CustomError &&
      error.message === 'Usuario y/o contraseña invalidos'
    ) {
      return httpResponse.BAD_REQUEST(res, ErrorsMessage.INVALID_CREDENTIALS)
    }
    return httpResponse.ERROR(res, error.message)
  }
}

const validateLogin = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const { userToken } = req
  return httpResponse.ACCEPTED(res, userToken)
}

const getUsers = async (
  _req: Request,
  res: Response,
): Promise<void | Response> => {
  try {
    const users = await getAllUsers()
    return httpResponse.OK(res, users)
  } catch (error: any) {
    return httpResponse.ERROR(res, error.message)
  }
}

export default {
  createUser,
  login,
  getUsers,
  getUserFromEmailToken,
  validateLogin,
  changevalidationUser,
}
