import { ObjectId } from 'mongoose'

export type ProvinceTypes =
  | 'Azuay'
  | 'Bolívar'
  | 'Cañar'
  | 'Carchi'
  | 'Chimborazo'
  | 'Cotopaxi'
  | 'El Oro'
  | 'Esmeraldas'
  | 'Galápagos'
  | 'Guayas'
  | 'Imbabura'
  | 'Loja'
  | 'Los Ríos'
  | 'Manabí'
  | 'Morona Santiago'
  | 'Napo'
  | 'Orellana'
  | 'Pastaza'
  | 'Pichincha'
  | 'Santa Elena'
  | 'Santo Domingo'
  | 'Sucumbíos'
  | 'Tungurahua'
  | 'Zamora'

type Areas = 'Urbano' | 'Rural' | 'Natural'

type UrbanArea =
  | 'Moderno'
  | 'Histórico'
  | 'Residencial'
  | 'Parques y Plazas'
  | 'Deportivos'
  | 'Cultural'
  | 'Negocios y Comercios'

type RuralArea = 'Pueblos' | 'Carreteras'

type NaturalArea = 'Reservas Ecológicas' | 'Playas'

interface file {
  url: string
  _id?: ObjectId
}

export interface LocationTypes {
  id?: string
  name: string
  type: 'Público' | 'Privado'
  description: string
  descriptionEn: string
  category: Areas
  subCategory: (UrbanArea | RuralArea | NaturalArea)[]
  province?: string
  city?: string
  requestInformation: string
  requestInformationEn: string
  weather: string[]
  accessibilities: string[]
  services: string[]
  nearbyServices: string[]
  contactName: string
  email: string
  phone: string
  address?: string
  coordinates?: string[]
  photos?: file[]
  public?: boolean
  created?: Date
  activeWhatsapp?: boolean
  userId?: ObjectId
}
