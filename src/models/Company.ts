import { Schema, model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { CompanyTypes } from '../types/companyTypes'

const companySchema = new Schema<CompanyTypes>({
  company: {
    type: String,
    required: true,
    minlength: 2,
    unique: true,
  },
  firstActivity: {
    type: String,
    required: true,
  },
  secondActivity: {
    type: String,
  },
  province: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  descriptionENG: {
    type: String,
    required: true,
  },
  clients: {
    type: [String],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  urlVideo: {
    type: String,
    required: true,
  },
  typeVideo: {
    type: String,
    required: true,
    enum: ['YouTube', 'Vimeo'],
  },
  logo: {
    type: {
      url: { type: String },
    },
    default: {},
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
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  public: {
    type: Boolean,
    default: true,
  },
  activeWhatsapp: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: new Date(),
  },
})

companySchema.set('toJSON', {
  transform(_doctument, returnedObject) {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

companySchema.plugin(mongooseUniqueValidator)

const Company = model<CompanyTypes>('Service', companySchema)

export default Company
