import { Request, Response } from 'express'
import { HttpResponse } from '../shared/HttpResponse'
import {
  createLocation,
  deleteLocationFile,
  destroyLocation,
  fetchLocations,
  findLocationById,
  updateLocationFiles,
  updateLoction as updateLocationServices,
} from '../services/location.service'
import { CustomError, ErrorsMessage } from '../shared/CustomError'
import { AuthenticatedRequest, UserType } from '../types/userTypes'
import { LocationTypes } from '../types/locationTypes'
import { MongooseError } from 'mongoose'
import { deleteLocationFromUser } from '../services/users.service'

const httpResponse = new HttpResponse()

const getLocation = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const { id } = req.params
  try {
    const response = await findLocationById(id)
    return httpResponse.OK(res, response)
  } catch (error: any) {
    if (
      error instanceof CustomError &&
      error.message === ErrorsMessage.NOT_EXIST
    ) {
      return httpResponse.ERROR(res, error.message)
    }
    return httpResponse.ERROR(res, error.message)
  }
}

const getLocations = async (
  _req: Request,
  res: Response,
): Promise<void | Response> => {
  try {
    const response = await fetchLocations()
    return httpResponse.OK(res, response)
  } catch (error: any) {
    console.error(error)
    if (
      error instanceof CustomError &&
      error.message === ErrorsMessage.SERVER_ERROR
    ) {
      return httpResponse.ERROR(res, error.message)
    }
    return httpResponse.ERROR(res, error.message)
  }
}

const postLocation = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const { id } = req.userToken as Pick<UserType, 'id'>
  const { body } = req

  const locationToCreate: LocationTypes = {
    ...body,
    userId: id,
  }

  try {
    const response = await createLocation(locationToCreate)
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

    if (error instanceof MongooseError && error.name === 'ValidationError') {
      return httpResponse.BAD_REQUEST(res, ErrorsMessage.INVALID_DATA)
    }

    return httpResponse.ERROR(res, error.message)
  }
}

const updateLocation = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const locationToUpdate = req.body

  try {
    const locationUpdated = await updateLocationServices(locationToUpdate)
    return httpResponse.ACCEPTED(res, locationUpdated)
  } catch (error: any) {
    console.error(error)
    if (error instanceof CustomError) {
      switch (error.message) {
        case ErrorsMessage.NOT_EXIST:
          return httpResponse.NOT_FOUND(res, error.message)
      }
    }
    return httpResponse.ERROR(res, error.message)
  }
}

const updateLocationFilesController = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  try {
    const { locationId } = req.body
    const location = await findLocationById(locationId)

    if (!location) {
      return httpResponse.BAD_REQUEST(res)
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return httpResponse.BAD_REQUEST(res, { error: 'No files uploaded' })
    }

    const updatedLocation = await updateLocationFiles(location, req.files[0])
    return httpResponse.BAD_REQUEST(res, updatedLocation)
  } catch (error: any) {
    console.error('Error en updateCompanyFilesController:', error)
    if (error instanceof CustomError) {
      return httpResponse.ERROR(res, error.message)
    }
    return httpResponse.ERROR(res, { error: (error as any).message })
  }
}

const deleteLocationFileController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { locationId, fileId } = req.body
    const location = await findLocationById(locationId)

    if (!location) {
      return httpResponse.BAD_REQUEST(res)
    }

    const locationUpdated = await deleteLocationFile(location, fileId)
    return httpResponse.ACCEPTED(res, locationUpdated)
  } catch (error: any) {
    console.error('Error en deleteCompanyFileController:', error)
    if (error instanceof CustomError) {
      return httpResponse.ERROR(res, error.message)
    }
    return httpResponse.ERROR(res, { error: (error as any).message })
  }
}

const deleteLocation = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const locationId = req.params.id
  const { id } = req.userToken as Pick<UserType, 'id'>

  try {
    await destroyLocation(locationId)
    await deleteLocationFromUser(locationId, id.toString())
    httpResponse.OK(res)
  } catch (error: any) {
    console.error(error)
    if (error instanceof CustomError) {
      switch (error.message) {
        case ErrorsMessage.NOT_EXIST:
          return httpResponse.NOT_FOUND(res, error.message)
        case ErrorsMessage.SERVER_ERROR:
          return httpResponse.BAD_REQUEST(res, error.message)
        default:
          return httpResponse.ERROR(res, error.message)
      }
    }
    return httpResponse.ERROR(res, error.message)
  }
}

export default {
  getLocation,
  getLocations,
  postLocation,
  updateLocation,
  updateLocationFiles: updateLocationFilesController,
  deleteLocationFile: deleteLocationFileController,
  deleteLocation,
}
