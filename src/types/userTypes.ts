import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongoose'

export enum UserRoleType {
  ADMIN = 'admin',
  CREATOR = 'creator',
  VIEWER = 'viewer',
}

export interface UserType {
  username: string
  email: string
  password: string
  role?: UserRoleType
  id: ObjectId
  validation?: Boolean
  profile?: ObjectId
  locations?: ObjectId[]
}

export interface UserForToken {
  username: string
  id: string
}

export interface UserForValidateEmail {
  username: string
  email: string
}

export interface UserLoginPayload {
  username: string
  userToken: string
  email: string
  role: UserType['role']
  profile?: string
}

export interface AuthenticatedRequest extends Request {
  userToken?: string | JwtPayload
}

export interface DecodedToken {
  username?: string
  id?: string
  iat: string
  exp: string
}

export interface RequestDecodedToken extends Request {
  userToken?: DecodedToken
}
