import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Response } from 'express'
import config from '../config/envConfig'
import { AuthenticatedRequest } from '../types'

const SECRET = config.SECRET

const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const authorization = req.get('authorization')

  try {
    let token: string | null = null

    if (
      authorization &&
      authorization.toLocaleLowerCase().startsWith('bearer ')
    ) {
      token = authorization.replace(/bearer\s+/i, '')
    }

    if (!token) {
      return res.status(401).json({ error: 'No tiene credenciales' })
    }

    if (!SECRET) {
      throw new Error('El secreto de JWT no está definido')
    }

    const decodedToken = jwt.verify(token, SECRET) as JwtPayload

    if (!decodedToken) {
      return res.status(401).json({ error: 'credenciales invalidas' })
    }

    req.userToken = decodedToken

    next()
  } catch (error) {
    return res.status(401).json({ error: 'credenciales invalidas' })
  }
}

export default verifyToken
