export type provinceTypes =
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

export type categoryLocationTypes =
  | 'Área Urbana'
  | 'Área Rural'
  | 'Área Natural'

export interface ILocation {
  name: string
  description: string
  category: categoryLocationTypes
  province: provinceTypes
  city: string
  weather: string
  accessibility: string
  direction: string
  map: string
  contact: string
}
