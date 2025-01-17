import { Schema, model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { UserProfile } from '../types/profileTypes'

const userProfileSchema = new Schema<UserProfile>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  identificationType: {
    type: String,
    required: true,
    enum: ['Cédula', 'Pasaporte', 'RUC'],
  },
  identification: {
    type: String,
    require: true,
    unique: true,
  },
  nationality: {
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
  cellPhone: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    enum: ['Masculino', 'Femenino', 'No especificado'],
    require: true,
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

const UserProfile = model<UserProfile>('UserProfile', userProfileSchema)

export default UserProfile
