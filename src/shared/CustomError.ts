import { HttpStatus } from './HttpResponse'

export enum ErrorsMessage {
  USER_EXIST = 'Usuario o email ya se encuentra registrado',
  INVALID_DATA = 'Datos incorrectos',
  INVALID_CREDENTIALS = 'Usuario y/o contraseña invalidos',
  INVALID_TOKEN = 'Token invalido, sin autorización',
  NOT_EXIST = 'El recurso al que intenta acceder no existe',
  SERVER_ERROR = 'Error en el servidor',
  EMAIL_UNAUTHENTICATE = 'Usuario debe validar su correo antes de iniciar sesión',
}

export class CustomError extends Error {
  constructor(statusCode: HttpStatus, message: ErrorsMessage) {
    super(message)
    this.statusCode = statusCode
  }
  statusCode: HttpStatus
}
