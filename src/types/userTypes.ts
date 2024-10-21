import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongoose'

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
  id: ObjectId
  validation?: Boolean
  profile?: string
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

export interface DecodedToken {
  name?: string
  id?: string
  iat: string
  exp: string
}

export interface RequestDecodedToken extends Request {
  userToken?: DecodedToken
}
