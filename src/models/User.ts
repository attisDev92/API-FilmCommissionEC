import { Schema, model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { UserType } from '../types/userTypes'

const userSchema = new Schema<UserType>({
  username: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'creator', 'viewer'],
    default: 'viewer',
  },
  validation: {
    type: Boolean,
    default: false,
  },
  profile: {
    type: Schema.ObjectId,
    ref: 'UserProfile',
  },
  locations: [
    {
      type: Schema.ObjectId,
      ref: 'Location',
    },
  ],
  companies: [
    {
      type: Schema.ObjectId,
      ref: 'Service',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

userSchema.plugin(mongooseUniqueValidator)

const User = model<UserType>('User', userSchema)

export default User
