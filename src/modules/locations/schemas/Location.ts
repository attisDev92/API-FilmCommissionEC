import { Schema, model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { LocationTypes } from '../interfaces/location.interface'

const locationSchema = new Schema<LocationTypes>({
  name: {
    type: String,
    minlength: 4,
    required: true,
  },
  type: {
    type: String,
    enum: ['Público', 'Privado'],
    required: true,
  },
  description: {
    type: String,
    minlength: 50,
    required: true,
  },
  descriptionEn: {
    type: String,
    minlength: 50,
    required: true,
  },
  category: {
    type: String,
    minlength: 5,
    required: true,
  },
  subCategory: {
    type: [String],
    required: true,
  },
  province: {
    type: String,
  },
  city: {
    type: String,
  },
  requestInformation: {
    type: String,
    minlength: 50,
    required: true,
  },
  requestInformationEn: {
    type: String,
    minlength: 50,
    required: true,
  },
  weather: {
    type: [String],
    required: true,
  },
  accessibilities: {
    type: [String],
    required: true,
  },
  services: {
    type: [String],
    required: true,
  },
  nearbyServices: {
    type: [String],
    required: true,
  },
  contactName: {
    type: String,
    minlength: 3,
  },
  email: {
    type: String,
    minlength: 5,
  },
  phone: {
    type: String,
    minlength: 10,
  },
  phoneNumber: {
    type: String,
    minLenght: 5,
  },
  address: {
    type: String,
  },
  coordinates: {
    type: [String],
  },
  photos: {
    type: [
      {
        url: {
          type: String,
        },
      },
    ],
    default: [],
  },
  public: {
    type: Boolean,
    default: true,
  },
  activeWhatsapp: {
    type: Boolean,
    default: false,
  },
  website: {
    type: String,
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

locationSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

locationSchema.plugin(mongooseUniqueValidator)

const Location = model<LocationTypes>('Location', locationSchema)

export default Location
