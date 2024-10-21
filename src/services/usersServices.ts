import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {
  IUser,
  IUserForToken,
  IUserForValidateEmail,
  IUserLoginPayload,
  UserRoleType,
} from '../types/userTypes'
import config from '../config/envConfig'
import User from '../models/User'
import { CustomError, ErrorsMessage } from '../shared/CustomError'
import { HttpStatus } from '../shared/HttpResponse'
import { EmailOptions, sendEmail } from '../utils/mailer'

export const createNewUser = async ({
  name,
  email,
  password,
  role,
}: Omit<IUser, 'id'>): Promise<IUser> => {
  const nameAlreadyExist = await User.findOne({
    name,
  })
  const mailAlreadyExist = await User.findOne({
    email,
  })

  if (nameAlreadyExist || mailAlreadyExist)
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.USER_EXIST)

  const passwordHash: string = await bcrypt.hash(password, config.SALT)

  const user = new User({
    name,
    password: passwordHash,
    email,
    role: role ? role : UserRoleType.VIEWER,
  })

  await user.save()
  return user
}

export const sendValidationUserCode = async (user: IUser): Promise<void> => {
  const userForValidateEmail: IUserForValidateEmail = {
    name: user.name,
    email: user.email,
  }

  if (!config.SECRET_MAIL) {
    throw new Error('SECRET no se encuentra definido')
  }
  const emailToken: string = jwt.sign(userForValidateEmail, config.SECRET_MAIL)
  const linkWithTokenForEmail: string = `${config.FrontURL}/users/emailAuth/${emailToken}`

  const emailOptions: EmailOptions = {
    to: user.email,
    subject: 'Verificación de correo electrónico',
    text: `Tu código de verificación es ${linkWithTokenForEmail}`,
    html: `
      <p>Hola ${user.name},</p>
      </br>
      <p>Para continuar con el registro como usuario del catálogo de locaciones de Ecuador Film Commission</p>
      <p>debes verificar tu mail ingresando al siguiente link: <strong><a href="${linkWithTokenForEmail}" target="_blank"> VERIFICAR EMAIL </a></strong></p>
      </br>
      <p>Si no te has registrado en esta web, por favor ignora este mensaje</p>
    `,
  }
  await sendEmail(emailOptions)
}

export const validateEmailUser = async (params: any): Promise<IUser> => {
  if (!config.SECRET_MAIL) throw new Error('SECRET de JWT no está definido')

  const decodedEmail = jwt.verify(params, config.SECRET_MAIL) as JwtPayload
  const user = await User.findOne({ email: decodedEmail.email })

  if (!user)
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)

  return user
}

export const validateUser = async (name: Pick<IUser, 'name'>) => {
  const user = await User.findOne(name)

  if (!user)
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)

  user.validation = true
  return user.save()
}

export const loginUser = async ({
  email,
  password,
}: Pick<IUser, 'email' | 'password'>): Promise<IUserLoginPayload> => {
  const user = await User.findOne({ email })

  const passwordDecoded: boolean = user
    ? await bcrypt.compare(password, user.password)
    : false

  if (!(user && passwordDecoded)) {
    throw new CustomError(
      HttpStatus.BAD_REQUEST,
      ErrorsMessage.INVALID_CREDENTIALS,
    )
  }

  const userForToken: IUserForToken = {
    name: user.name,
    id: user.id,
  }

  if (!config.SECRET_USER) {
    throw new Error('SECRET no se encuentra definido')
  }

  const userToken: string = jwt.sign(userForToken, config.SECRET_USER, {
    expiresIn: 24 * 60 * 60,
  })
  return { userToken, name: user.name }
}

export const getAllUsers = async (): Promise<IUser[] | Error> => {
  const users: IUser[] = await User.find({})
  return users
}
