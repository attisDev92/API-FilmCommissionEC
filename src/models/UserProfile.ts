import { Schema, model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { IUserProfile } from '../types/profileTypes'

const userProfileSchema = new Schema<IUserProfile>({
  typeIdentification: {
    type: String,
    required: true,
    enum: ['Cédula', 'Pasaporte', 'RUC'],
  },
  identification: {
    type: String,
    require: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  residenceCity: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
    enum: ['Hombre', 'Mujer', 'No especificado'],
    require: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
})

userProfileSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

userProfileSchema.plugin(mongooseUniqueValidator)

const UserProfile = model<IUserProfile>('UserProfile', userProfileSchema)

export default UserProfile
