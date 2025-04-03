import dotenv from 'dotenv'
import { error } from '../utils/logger'

dotenv.config()

const PORT = process.env.PORT || 3000

const FrontURL =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONT_PRODUCTION
    : process.env.FRONT_DEV

const SECRET_USER = process.env.SECRETE_USER_WORD
const SALT: number = 10
const MAIL = process.env.MAIL_USER
const MAIL_PASSWORD = process.env.MAIL_PASSWORD
const SECRET_MAIL = process.env.SECRET_EMAIL_WORD

// Definir MONGO_URI según el entorno
let MONGO_URI: string
let firebaseStorage: string
let allowedOrigins: string[]

switch (process.env.NODE_ENV) {
  case 'production':
    MONGO_URI = process.env.MONGODB_URI || ''
    firebaseStorage = process.env.FIREBASE_STORAGE || ''
    allowedOrigins = ['https://ecuadorfilmcommission.com']
    break
  case 'development':
    MONGO_URI = process.env.MONGODB_URI_DEV || ''
    firebaseStorage = process.env.FIREBASE_STORAGE_DEV || ''
    allowedOrigins = [process.env.FRONT_DEV || '']
    break
  case 'test':
    MONGO_URI = process.env.MONGODB_URI_TEST || ''
    firebaseStorage = process.env.FIREBASE_STORAGE_TEST || ''
    allowedOrigins = [process.env.FRONT_DEV || '']
    break
  default:
    error('NODE_ENV is invalid')
    throw new Error(
      'NODE_ENV is not set to a valid value (production, development, test)',
    )
}

// Verificar que MONGO_URI esté definido
if (!MONGO_URI) {
  throw new Error('Database URI is not defined for the current environment')
}

export default {
  PORT,
  MONGO_URI,
  SECRET_USER,
  SALT,
  MAIL,
  MAIL_PASSWORD,
  SECRET_MAIL,
  FrontURL,
  firebaseStorage,
  allowedOrigins,
}
