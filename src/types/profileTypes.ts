import { ObjectId } from 'mongoose'

type identificationTipe = 'Cédula' | 'Pasaporte' | 'RUC'
type genreType = 'Hombre' | 'Mujer' | 'No especificado'

export interface IUserProfile {
  typeIdentification: identificationTipe
  identification: string
  country: string
  residenceCity: string
  birthdate: Date
  genre: genreType
  firstName: string
  lastName: string
  countryCode: string
  phone: string
  userId: ObjectId
}
