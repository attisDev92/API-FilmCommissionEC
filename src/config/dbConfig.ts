import mongoose from 'mongoose'
import config from './envConfig'

const connectDataBase = async (): Promise<void> => {
  try {
    if (!config.MONGO_URI) {
      throw new Error('Mongo URI is not defined')
    }
    await mongoose.connect(config.MONGO_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.error(`Error connecting to MongoDB`, error)
    process.exit(1)
  }
}

export default connectDataBase
