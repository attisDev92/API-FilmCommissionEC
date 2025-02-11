import dotenv from 'dotenv'
import { error } from '../utils/logger'

dotenv.config()

const PORT = process.env.PORT || 3000

// const MONGO_URI =
//   process.env.NODE_ENV === 'production'
//     ? process.env.MONGODB_URI
//     : process.env.NODE_ENV === 'development'
//       ? process.env.MONGODB_URI_DEV
//       : process.env.MONGODB_URI_TEST

const FrontURL =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONT_PRODUCTION
    : process.env.FRONT_DEV

const SECRET_USER = process.env.SECRETE_USER_WORD
const SALT: number = 10
const MAIL = process.env.MAIL_USER
const MAIL_PASSWORD = process.env.MAIL_PASSWORD
const SECRET_MAIL = process.env.SECRET_EMAIL_WORD

let MONGO_URI
let firebaseStorage
let allowedOrigins

if (process.env.NODE_ENV === 'production') {
  MONGO_URI = process.env.MONGODB_URI
  firebaseStorage = process.env.FIREBASE_STORAGE
  allowedOrigins = ['https://ecuadorfilmcommission.com']
} else if (process.env.NODE_ENV === 'development') {
  MONGO_URI = process.env.MONGODB_URI_DEV
  firebaseStorage = process.env.FIREBASE_STORAGE_DEV
  allowedOrigins = [process.env.FRONT_DEV]
} else if (process.env.NODE_ENV === 'test') {
  MONGO_URI = process.env.MONGODB_URI_TEST
  firebaseStorage = process.env.FIREBASE_STORAGE_TEST
  allowedOrigins = [process.env.FRONT_DEV]
} else {
  error('NODE_ENV is invalid')
  if (!MONGO_URI) {
    throw new Error('Database URI is not defined for the current environment')
  }
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
