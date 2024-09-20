import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000

const MONGO_URI =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI
    : process.env.NODE_ENV === 'development'
      ? process.env.MONGODB_URI_DEV
      : process.env.MONGODB_URI_TEST

if (!MONGO_URI) {
  throw new Error('Database URI is not defined for the current environment')
}

const SECRET = process.env.SECRETE_USER_WORD
const SALT: number = 10

export default {
  PORT,
  MONGO_URI,
  SECRET,
  SALT,
}
