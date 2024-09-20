import { IUser } from '../../types'
import User from '../../models/User'

export const initialUsers: Omit<IUser, 'id'>[] = [
  {
    name: 'User1',
    email: 'user1@usermail.com',
    password: 'passworduser1',
    role: 'creator',
  },
]

export const newUser: Omit<IUser, 'id'> = {
  name: 'Test User',
  email: 'test@usermail.com',
  password: 'passwordTest',
  role: 'creator',
}

export const invalidUser: Omit<IUser, 'id' | 'role'> = {
  name: 'not',
  email: 'notmail',
  password: '',
}

export const createInitialUser = async (
  user: Omit<IUser, 'id'>,
): Promise<IUser> => {
  const newUser = new User({ ...user })
  const userSaved = await newUser.save()
  return userSaved
}

export const fetchInitialUsers = async (): Promise<IUser[]> => {
  let response: IUser[] = []

  for (let user of initialUsers) {
    const newUser: IUser = await createInitialUser(user)
    response.push(newUser)
  }

  return response
}
