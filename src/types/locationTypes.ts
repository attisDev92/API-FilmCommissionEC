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

export type CategoryLocationTypes =
  | 'Área Urbana'
  | 'Área Rural'
  | 'Área Natural'

export interface LocationType {
  name: string
  description: string
  category: CategoryLocationTypes
  province: ProvinceTypes
  city: string
  weather: string
  accessibility: string
  direction: string
  map: string
  contact: string
}
