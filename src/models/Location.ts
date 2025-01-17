import mongooseUniqueValidator from 'mongoose-unique-validator'

import { Schema, model } from 'mongoose'

const locationSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
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
  weather: {
    type: String,
    minlength: 3,
    required: true,
  },
  accessibility: {
    type: String,
    minlength: 3,
    required: true,
  },
  direction: {
    type: String,
    minlength: 3,
    required: true,
  },
  map: {
    type: String,
    minlength: 3,
    required: true,
  },
  contact: {
    type: String,
    minlength: 3,
    required: true,
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

const Location = model('Location', locationSchema)

export default Location
