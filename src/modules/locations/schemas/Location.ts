import { Schema, model } from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { LocationTypes } from '../interfaces/location.interface'

const locationSchema = new Schema<LocationTypes>({
  name: {
    type: String,
    minlength: 5,
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
  category: {
    type: String,
    minlength: 50,
    enum: ['Urbano', 'Rutal', 'Natural'],
    required: true,
  },
  subCategory: {
    type: [String],
    required: true,
  },
  province: {
    type: String,
    required: true,
    enum: [
      'Azuay',
      'Bolívar',
      'Cañar',
      'Carchi',
      'Chimborazo',
      'Cotopaxi',
      'El Oro',
      'Esmeraldas',
      'Galápagos',
      'Guayas',
      'Imbabura',
      'Loja',
      'Los Ríos',
      'Manabí',
      'Morona Santiago',
      'Napo',
      'Orellana',
      'Pastaza',
      'Pichincha',
      'Santa Elena',
      'Santo Domingo',
      'Sucumbíos',
      'Tungurahua',
      'Zamora',
    ],
  },
  city: {
    type: String,
    minlength: 3,
    required: true,
  },
  requestInformation: {
    type: String,
    minlength: 50,
    required: true,
  },
  weather: {
    type: String,
    minlength: 3,
    enum: [
      'Cálido',
      'Húmedo',
      'Seco',
      'Semiseco',
      'Frío',
      'Templado',
      'Tropical',
      'Polar',
    ],
    required: true,
  },
  accessibilities: {
    type: [String],
    required: true,
  },
  contactName: {
    type: String,
    minlength: 3,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    required: true,
  },
  phone: {
    type: String,
    minlength: 10,
    required: true,
  },
  direction: {
    type: String,
    minlength: 3,
  },
  cordinates: {
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
    default: {},
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
