import { IUser, IUserForValidateEmail, UserRoleType } from '../../types'
import User from '../../models/User'
import config from '../../config/envConfig'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const initialUsers: Omit<IUser, 'id'>[] = [
  {
    name: 'User1',
    email: 'user1@usermail.com',
    password: 'passworduser1',
  },
]

export const newUser: Omit<IUser, 'id'> = {
  name: 'Test User',
  email: 'attis.alejandro@gmail.com',
  password: 'passwordTest',
  role: UserRoleType.CREATOR,
}

export const invalidUser: Omit<IUser, 'id'> = {
  name: 'not',
  email: 'notmail',
  password: '',
}

export const createInitialUser = async (
  user: Omit<IUser, 'id'>,
): Promise<IUser> => {
  const passwordHash: string = await bcrypt.hash(user.password, config.SALT)
  const newUser = new User({ ...user, password: passwordHash })
  const userSaved = await newUser.save()

  return userSaved
}

export const createEmailValidationToken = async (
  user: IUser,
): Promise<string> => {
  const userForValidateEmail: IUserForValidateEmail = {
    name: user.name,
    email: user.email,
  }

  if (!config.SECRET_MAIL) {
    throw new Error('SECRET no se encuentra definido')
  }
  const emailToken: string = jwt.sign(userForValidateEmail, config.SECRET_MAIL)

  return emailToken
}

// export const fetchInitialUsers = async (): Promise<IUser[]> => {
//   let response: IUser[] = []

//   for (let user of initialUsers) {
//     const newUser: IUser = await createInitialUser(user)
//     response.push(newUser)
//   }

//   return response
// }
