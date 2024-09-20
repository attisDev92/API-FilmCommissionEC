import mongoose from 'mongoose'
import config from './src/config/envConfig'

beforeAll(async () => {
  await mongoose.connect(config.MONGO_URI)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase
  await mongoose.connection.close()
})
