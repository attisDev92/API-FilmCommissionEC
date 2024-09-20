import bcrypt from 'bcrypt'
import { IUser, IErrorMessage } from '../types'
import config from '../config/envConfig'
import User from '../models/User'

export const createNewUser = async ({
  name,
  email,
  password,
  role,
}: Omit<IUser, 'id'>): Promise<IUser | IErrorMessage> => {
  try {
    const passwordHash = await bcrypt.hash(password, config.SALT)

    const nameAlreadyExist = await User.findOne({ name: name })
    const mailAlreadyExist = await User.findOne({ email: email })

    if (nameAlreadyExist || mailAlreadyExist) {
      return {
        error: 'usuario o email incorrectos',
        status: 400,
      }
    }

    const user = new User({
      name,
      password: passwordHash,
      email,
      role: role ? role : 'viewer',
    })

    const savedUser: IUser = await user.save()

    return savedUser
  } catch (error) {
    return { error: 'error al crear usuario' }
  }
}

export const getAllUsers = async (): Promise<IUser[] | IErrorMessage> => {
  try {
    const users = await User.find({})
    return users
  } catch (error) {
    return { error: 'Error al obtener los usuarios', status: 500 }
  }
}
