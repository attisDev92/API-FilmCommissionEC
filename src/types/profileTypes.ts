import { Dayjs } from 'dayjs'
import { ObjectId } from 'mongoose'

type identificationTipe = 'Cédula' | 'Pasaporte' | 'RUC'
type genreType = 'Masculino' | 'Femenino' | 'No especificado'

export interface UserProfile {
  firstName: string
  lastName: string
  identificationType: identificationTipe
  identification: string
  nationality: string
  residenceCity: string
  birthdate: Dayjs
  cellPhone: string
  genre: genreType
  userId?: ObjectId
  created?: Date
}
