import { Schema, model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { UserProfile } from '../interfaces/profile.interface'

const userProfileSchema = new Schema<UserProfile>({
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: 2,
  },
  lastName: {
    type: String,
    minlength: 2,
    required: [true, 'El apellido es obligatorio'],
  },
  identificationType: {
    type: String,
    required: true,
    enum: ['Cédula', 'Pasaporte', 'RUC'],
  },
  identification: {
    type: String,
    unique: true,
    minlength: 2,
    require: [true, 'La identificación es obligatoria'],
  },
  nationality: {
    type: String,
    minlength: 1,
    required: [true, 'La nacionalidad es obligatoria'],
  },
  residenceCity: {
    type: String,
    minlength: 1,
    required: [true, 'La ciudad de residencia es obligatoria'],
  },
  birthdate: {
    type: Date,
    required: [true, 'La fecha de nacimiento es obligatoria'],
  },
  cellPhone: {
    type: String,
    minlength: 7,
    required: [true, 'El teléfono celular es obligatorio'],
  },
  genre: {
    type: String,
    enum: ['Masculino', 'Femenino', 'No especificado'],
    require: true,
  },
  created: {
    type: Date,
    default: new Date(),
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
