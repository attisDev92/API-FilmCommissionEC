import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export type userRoleType = 'admin' | 'creator' | 'viewer'

export interface IErrorMessage {
  error: string
  status?: number
}

export interface IUser {
  name: string
  email: string
  password: string
  role?: userRoleType
  id: string
}

export interface IUserForToken {
  name: string
  id: string
}

export interface AuthenticatedRequest extends Request {
  userToken?: string | JwtPayload
}
