import { ObjectId } from 'mongoose'

interface file {
  url: string
  _id?: ObjectId
}

export interface CompanyTypes {
  company: string
  firstActivity: string
  secondActivity?: string
  province: string
  city: string
  direction: string
  description: string
  descriptionENG: string
  clients: string[]
  email: string
  phone: string
  website: string
  urlVideo: string
  typeVideo: 'YouTube' | 'Vimeo'
  logo: file
  photos: file[]
  userId: ObjectId
  created?: Date
}
