import { Response, NextFunction } from 'express'
import User from '../modules/users/schemas/User'
import { HttpResponse } from '../shared/HttpResponse'
import { ErrorsMessage } from '../shared/CustomError'
import { RequestDecodedToken } from '../modules/users/interfaces/user.interface'

const httpResponse = new HttpResponse()

const verifyAdmin = async (
  req: RequestDecodedToken,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const id = req.userToken?.id

  try {
    const user = await User.findById(id)

    if (!user || user.role !== 'admin') {
      return httpResponse.FORBIDDEN(res, ErrorsMessage.INVALID_CREDENTIALS)
    }

    return next()
  } catch (error: any) {
    return httpResponse.ERROR(res, error.message)
  }
}

export default verifyAdmin
