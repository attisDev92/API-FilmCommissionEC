import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Response } from 'express'
import config from '../config/envConfig'
import { AuthenticatedRequest } from '../types'

const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<AuthenticatedRequest | Response | void> => {
  const authorization = req.get('authorization')
  let token: string | null = null

  if (
    authorization &&
    authorization.toLocaleLowerCase().startsWith('bearer ')
  ) {
    token = authorization.replace(/bearer\s+/i, '')
  }

  if (!token) throw new Error('No tiene credenciales')
  if (!config.SECRET_USER) throw new Error('SECRET de JWT no está definido')

  const decodedToken = jwt.verify(token, config.SECRET_USER) as JwtPayload

  if (!decodedToken) {
    return res.status(401).json({ error: 'credenciales invalidas' })
  }

  req.userToken = decodedToken

  next()
}

export default verifyToken
