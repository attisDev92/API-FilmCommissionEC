import { Response } from 'express'

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class HttpResponse {
  OK(res: Response, data?: any): Response {
    return res.status(HttpStatus.OK).json({ success: true, data })
  }

  CREATED(res: Response, data?: any): Response {
    return res.status(HttpStatus.CREATED).json({ success: true, data })
  }

  ACCEPTED(res: Response, data?: any): Response {
    return res.status(HttpStatus.ACCEPTED).json({ success: true, data })
  }

  BAD_REQUEST(res: Response, data?: any): Response {
    return res.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      statusMsg: 'Bad Request',
      error: data,
    })
  }

  UNAUTHORIZED(res: Response, data?: any): Response {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      statusMsg: 'Unauthorized',
      error: data,
    })
  }

  FORBIDDEN(res: Response, data?: any): Response {
    return res.status(HttpStatus.FORBIDDEN).json({
      status: HttpStatus.FORBIDDEN,
      statusMsg: 'Forbidden',
      error: data,
    })
  }

  NOT_FOUND(res: Response, data?: any): Response {
    return res.status(HttpStatus.NOT_FOUND).json({
      status: HttpStatus.NOT_FOUND,
      statusMsg: 'Unauthorized',
      error: data,
    })
  }

  ERROR(res: Response, data?: any): Response {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      statusMsg: 'Internal Server Error',
      error: data,
    })
  }
}
