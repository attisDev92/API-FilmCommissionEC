import {
  UserType,
  UserForValidateEmail,
  UserRoleType,
} from '../../modules/users/interfaces/user.interface'
import User from '../../modules/users/schemas/User'
import config from '../../config/env.config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const initialUsers: Omit<UserType, 'id'>[] = [
  {
    username: 'User1',
    email: 'user1@usermail.com',
    password: 'passworduser1',
  },
  {
    username: 'User2',
    email: 'user2@usermail.com',
    password: 'passworduser2',
    role: UserRoleType.ADMIN,
  },
]

export const newUser: Omit<UserType, 'id'> = {
  username: 'Test User',
  email: 'test@gmail.com',
  password: 'passwordTest',
  role: UserRoleType.CREATOR,
}

export const invalidUser: Omit<UserType, 'id'> = {
  username: 'not',
  email: 'notmail',
  password: '',
}

export const createInitialUser = async (
  user: Omit<UserType, 'id'>,
): Promise<UserType> => {
  const passwordHash: string = await bcrypt.hash(user.password, config.SALT)
  const newUser = new User({ ...user, password: passwordHash })
  const userSaved = await newUser.save()

  return userSaved
}

export const createEmailValidationToken = async (
  user: UserType,
): Promise<string> => {
  const userForValidateEmail: UserForValidateEmail = {
    username: user.username,
    email: user.email,
  }

  if (!config.SECRET_MAIL) {
    throw new Error('SECRET no se encuentra definido')
  }
  const emailToken: string = jwt.sign(userForValidateEmail, config.SECRET_MAIL)

  return emailToken
}

export const fetchInitialUsers = async (): Promise<UserType[]> => {
  let response: UserType[] = []

  for (let user of initialUsers) {
    const newUser: UserType = await createInitialUser(user)
    response.push(newUser)
  }

  return response
}
