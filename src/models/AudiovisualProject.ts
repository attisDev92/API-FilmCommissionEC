import { Schema, model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { AudiovisualProjectTypes } from '../types/projectTypes'

const audiovisualProjectSchema = new Schema<AudiovisualProjectTypes>({
  name: {
    type: String,
    minlength: 3,
    unique: true,
    required: true,
  },
  director: {
    type: String,
    minlength: 3,
    required: true,
  },
  producer: {
    type: String,
    minlength: 3,
    required: true,
  },
  productionCompany: {
    type: String,
    minlength: 3,
    required: true,
  },
  sinopsis: {
    type: String,
    minlength: 100,
    required: true,
  },
  sinopsisEng: {
    type: String,
    minlength: 100,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  coproducers: {
    type: [String],
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  runTime: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  subGenres: {
    type: [String],
    required: true,
  },
  currentSituation: {
    type: String,
    required: true,
  },
  needs: {
    type: String,
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
  },
  recognitions: {
    type: [String],
  },
  directorPhoto: {
    type: {
      url: { type: String },
    },
    default: {},
  },
  producerPhoto: {
    type: {
      url: { type: String },
    },
    default: {},
  },
  afiche: {
    type: {
      url: { type: String },
    },
    default: {},
  },
  stills: {
    type: [
      {
        url: { type: String },
      },
    ],
    default: [],
  },
  dossier: {
    type: {
      url: { type: String },
    },
    default: {},
  },
  trailer: {
    type: String,
    minlength: 10,
  },
  public: {
    type: Boolean,
    default: true,
  },
  activeWhatsapp: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  created: {
    type: Date,
    default: new Date(),
  },
})

audiovisualProjectSchema.set('toJSON', {
  transform(_doctument, returnedObject) {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

audiovisualProjectSchema.plugin(mongooseUniqueValidator)

const AudiovisualProject = model<AudiovisualProjectTypes>(
  'AudiovisualProject',
  audiovisualProjectSchema,
)

export default AudiovisualProject
