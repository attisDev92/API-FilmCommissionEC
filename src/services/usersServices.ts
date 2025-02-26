import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {
  UserType,
  UserForToken,
  UserForValidateEmail,
  UserLoginPayload,
  UserRoleType,
} from '../types/userTypes'
import config from '../config/envConfig'
import User from '../models/User'
import { CustomError, ErrorsMessage } from '../shared/CustomError'
import { HttpStatus } from '../shared/HttpResponse'
import { EmailOptions, sendEmail } from '../utils/mailer'

export const createNewUser = async ({
  username,
  email,
  password,
}: Omit<UserType, 'id' | 'role'>): Promise<UserType> => {
  const nameAlreadyExist = await User.findOne({
    username,
  })
  const mailAlreadyExist = await User.findOne({
    email,
  })

  if (nameAlreadyExist || mailAlreadyExist)
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.USER_EXIST)

  const passwordHash: string = await bcrypt.hash(password, config.SALT)

  const user = new User({
    username,
    password: passwordHash,
    email,
    role: UserRoleType.CREATOR,
  })

  await user.save()
  return user
}

export const sendValidationUserCode = async (user: UserType): Promise<void> => {
  const userForValidateEmail: UserForValidateEmail = {
    username: user.username,
    email: user.email,
  }

  if (!config.SECRET_MAIL) {
    throw new Error('SECRET no se encuentra definido')
  }
  const emailToken: string = jwt.sign(userForValidateEmail, config.SECRET_MAIL)
  const linkWithTokenForEmail: string = `${config.FrontURL}system/auth/${emailToken}`

  const emailOptions: EmailOptions = {
    to: user.email,
    subject: 'Verificación de correo electrónico Ecuador Filmcommission',
    text: `Verifica tu correo electrónico`,
    html: `
      <p>Hola ${user.username},</p>
      </br>
      <p>Para continuar con el registro como usuario de la Comisión Fílmica de Ecuador</p>
      <p>debes verificar tu mail ingresando al siguiente link: <strong><a href="${linkWithTokenForEmail}" target="_blank"> VERIFICAR EMAIL </a></strong></p>
      </br>
      <p>Si no te has registrado en esta web, por favor ignora este mensaje</p>
    `,
  }
  await sendEmail(emailOptions)
}

export const validateEmailUser = async (params: any): Promise<UserType> => {
  if (!config.SECRET_MAIL) throw new Error('SECRET de JWT no está definido')

  const decodedEmail = jwt.verify(params, config.SECRET_MAIL) as JwtPayload
  const user = await User.findOne({ email: decodedEmail.email })

  if (!user)
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)

  return user
}

export const validateUser = async (userToken: string) => {
  if (!config.SECRET_MAIL) throw new Error('SECRET de JWT no está definido')

  const decodeToken = jwt.verify(userToken, config.SECRET_MAIL) as JwtPayload
  const user = await User.findOne({ email: decodeToken.email })

  if (!user)
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  user.validation = true

  return user.save()
}

export const loginUser = async ({
  username,
  password,
}: Pick<UserType, 'username' | 'password'>): Promise<UserLoginPayload> => {
  const user = await User.findOne({ username })
  const passwordDecoded: boolean = user
    ? await bcrypt.compare(password, user.password)
    : false

  if (!(user && passwordDecoded)) {
    throw new CustomError(
      HttpStatus.BAD_REQUEST,
      ErrorsMessage.INVALID_CREDENTIALS,
    )
  }

  if (!user?.validation) {
    throw new CustomError(
      HttpStatus.BAD_REQUEST,
      ErrorsMessage.EMAIL_UNAUTHENTICATE,
    )
  }

  const userForToken: UserForToken = {
    username: user.username,
    id: user.id,
  }

  if (!config.SECRET_USER) {
    throw new Error('SECRET no se encuentra definido')
  }

  const userToken: string = jwt.sign(userForToken, config.SECRET_USER, {
    expiresIn: 24 * 60 * 60,
  })
  return {
    id: user.id,
    userToken,
    username: user.username,
    email: user.email,
    role: user.role,
    profile: user.profile ? user.profile : Object(''),
  }
}

export const sendEmailToRevoverPass = async ({
  username,
  email,
}: Pick<UserType, 'username' | 'email'>) => {
  const user = await User.findOne({ username })

  if (!user || user.email !== email) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.INVALID_DATA)
  }

  if (!config.SECRET_MAIL) {
    throw new Error('SECRET no se encuentra definido')
  }
  const emailToken: string = jwt.sign({ username, email }, config.SECRET_MAIL)
  const linkWithTokenForEmail: string = `${config.FrontURL}system/recover_pass/${emailToken}`

  const emailOptions: EmailOptions = {
    to: user.email,
    subject: 'Recuperación de contraseña - Ecuador Filmcommission',
    text: `Recupera tu correo electrónico`,
    html: `
      <p>Hola ${user.username},</p>
      </br>
      <p>Para recuperar tu contraseña se debe acceder al siguiente link:</p>
      <p><strong><a href="${linkWithTokenForEmail}" target="_blank"> RECUPERAR CONTRASEÑA </a></strong></p>
      </br>
      <p>Si no has solicitado recuperar tu contraseña ignora este mensaje</p>
    `,
  }
  await sendEmail(emailOptions)
}

export const changeRecoverPass = async ({
  userToken,
  newPassword,
}: {
  userToken: string
  newPassword: string
}): Promise<UserType | void> => {
  if (!config.SECRET_MAIL) throw new Error('SECRET de JWT no está definido')

  const decodeToken = jwt.verify(userToken, config.SECRET_MAIL) as JwtPayload
  const user = await User.findOne({ email: decodeToken.email })

  if (!user)
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)

  const passwordHash: string = await bcrypt.hash(newPassword, config.SALT)

  user.password = passwordHash
  return user.save()
}

export const getAllUsers = async (): Promise<UserType[] | Error> => {
  const users = await User.find({})
  return users
}

export const deleteCompanyIdFromUser = async (
  companyId: string,
  userId: string,
) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.INVALID_DATA)
  }

  const companyExists = user.companies?.some(
    company => company.toString() === companyId,
  )

  if (!companyExists) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  user.companies = user.companies?.filter(
    company => company.toString() !== companyId,
  )

  await user.save()
}

export const deleteProjectIdFromUser = async (
  projectId: string,
  userId: string,
) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.INVALID_DATA)
  }

  const projectExist = user.audiovisualProjects?.some(
    project => project.toString() === projectId,
  )

  if (!projectExist) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  user.audiovisualProjects = user.audiovisualProjects?.filter(
    project => project.toString() !== projectId,
  )

  await user.save()
}
