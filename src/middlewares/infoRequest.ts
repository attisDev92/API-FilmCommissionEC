import { Request, Response, NextFunction } from 'express'

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('Params:', req.params)
  console.log('Body:', req.body)
  console.log('- - -')
  next()
}

export const unknownEndpoint = (_req: Request, res: Response): void => {
  res.status(404).send({ error: 'unknown endpoint' })
}
