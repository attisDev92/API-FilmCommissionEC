import { Response } from 'express'
import { AuthenticatedRequest, UserType } from '../types/userTypes'
import { getProfileFromUser, postNewProfile } from '../services/profileServices'
import { HttpResponse } from '../shared/HttpResponse'
import { CustomError, ErrorsMessage } from '../shared/CustomError'
import { UserProfile } from '../types/profileTypes'
import mongoose from 'mongoose'

const httpResponse = new HttpResponse()

const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const { id } = req.userToken as Pick<UserType, 'id'>

  try {
    const profile = await getProfileFromUser(id)
    return httpResponse.OK(res, profile)
  } catch (error: any) {
    if (error instanceof CustomError && error.statusCode === 404) {
      return httpResponse.NOT_FOUND(res, ErrorsMessage.NOT_EXIST)
    }

    return httpResponse.ERROR(res, error.message)
  }
}

const postProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const { id } = req.userToken as Pick<UserType, 'id'>
  const { body } = req

  const newProfile: UserProfile = {
    ...body,
    userId: id,
  }

  try {
    const response = await postNewProfile(newProfile)
    return httpResponse.CREATED(res, response)
  } catch (error: any) {
    console.error(error)
    if (error instanceof CustomError) {
      switch (error.message) {
        case ErrorsMessage.INVALID_DATA:
        case ErrorsMessage.NOT_EXIST:
          return httpResponse.BAD_REQUEST(res, error.message)
        default:
          return httpResponse.ERROR(res, error.message)
      }
    }

    if (error instanceof mongoose.Error && error.name === 'ValidationError') {
      return httpResponse.BAD_REQUEST(res, ErrorsMessage.INVALID_DATA)
    }

    return httpResponse.ERROR(res, error.message)
  }
}

export default {
  getProfile,
  postProfile,
}
