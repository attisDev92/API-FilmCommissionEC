import jwt from 'jsonwebtoken'
import { NextFunction, Response } from 'express'
import config from '../config/env.config'
import { AuthenticatedRequest } from '../modules/users/interfaces/user.interface'
import { ErrorsMessage } from '../shared/CustomError'
import { HttpResponse } from '../shared/HttpResponse'

const httpResponse = new HttpResponse()

const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<AuthenticatedRequest | Response | void> => {
  const authorization = req.get('authorization')

  try {
    let token: string | null = null

    if (
      authorization &&
      authorization.toLocaleLowerCase().startsWith('bearer ')
    ) {
      token = authorization.replace(/bearer\s+/i, '')
    }
    if (!token) return httpResponse.FORBIDDEN(res, ErrorsMessage.INVALID_TOKEN)

    if (!config.SECRET_USER) throw new Error('SECRET de JWT no está definido')

    const decodedToken = jwt.verify(token, config.SECRET_USER)
    if (!decodedToken) {
      return httpResponse.FORBIDDEN(res, ErrorsMessage.INVALID_TOKEN)
    }

    req.userToken = decodedToken
    next()
  } catch (error: any) {
    if (error.message === 'jwt malformed') {
      return httpResponse.FORBIDDEN(res, ErrorsMessage.INVALID_TOKEN)
    }
    return httpResponse.ERROR(res, error.message)
  }
}

export default verifyToken
