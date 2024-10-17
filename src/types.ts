import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export enum UserRoleType {
  ADMIN = 'admin',
  CREATOR = 'creator',
  VIEWER = 'viewer',
}

export interface IUser {
  name: string
  email: string
  password: string
  role?: UserRoleType
  id: string
  validation?: Boolean
}

export interface IUserForToken {
  name: string
  id: string
}

export interface IUserForValidateEmail {
  name: string
  email: string
}

export interface IUserLoginPayload {
  name: string
  userToken: string
}

export interface AuthenticatedRequest extends Request {
  userToken?: string | JwtPayload
}
