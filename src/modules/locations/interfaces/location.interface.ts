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

type WeatherTypes =
  | 'Cálido'
  | 'Húmedo'
  | 'Seco'
  | 'Semiseco'
  | 'Frío'
  | 'Templado'
  | 'Tropical'
  | 'Polar'

interface file {
  url: string
  _id?: ObjectId
}

export interface LocationTypes {
  id?: string
  name: string
  type: 'Público' | 'Privado'
  description: string
  category: Areas
  subCategory: (UrbanArea | RuralArea | NaturalArea)[]
  province: ProvinceTypes
  city: string
  requestInformation: string
  weather: WeatherTypes
  accessibilities: string[]
  contactName: string
  email: string
  phone: string
  direction?: string
  cordinates?: string[]
  photos?: file[]
  public?: boolean
  created?: Date
  activeWhatsapp?: boolean
  userId?: ObjectId
}
