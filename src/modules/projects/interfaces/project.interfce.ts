import { ObjectId } from 'mongoose'

interface file {
  url: string
  _id?: ObjectId
}

export interface AudiovisualProjectTypes {
  id?: string
  name: string
  director: string
  producer: string
  productionCompany: string
  sinopsis: string
  sinopsisEng: string
  country: string
  coproducers: string[]
  year: string
  runTime: string
  genre: 'Ficción' | 'Documental'
  subGenres: string[]
  currentSituation: 'Producción' | 'Post-Producción' | 'Distribución'
  needs: string
  needsENG: string
  email: string
  phone: string
  website?: string
  recognitions?: string[]
  directorPhoto?: file
  producerPhoto?: file
  afiche?: file
  stills?: file[]
  dossier?: file
  trailer?: file
  public?: boolean
  userId?: ObjectId
  created?: Date
  activeWhatsapp?: boolean
}
