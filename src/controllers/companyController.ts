import { Response } from 'express'
import { HttpResponse } from '../shared/HttpResponse'
import { AuthenticatedRequest, UserType } from '../types/userTypes'
import { createCompany, findCompanyById } from '../services/companiesServices'
import { CompanyTypes } from '../types/companyTypes'
import { ErrorsMessage, CustomError } from '../shared/CustomError'
import {
  updateCompanyFiles,
  deleteCompanyFile,
} from '../services/companiesServices'
import { MongooseError } from 'mongoose'

const httpResponse = new HttpResponse()

const postCompany = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const { id } = req.userToken as Pick<UserType, 'id'>
  const { body } = req

  const companyToCreate: CompanyTypes = {
    ...body,
    userId: id,
  }

  try {
    const response = await createCompany(companyToCreate)
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

const updateCompanyFilesController = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  try {
    const { companyId } = req.body
    const company = await findCompanyById(companyId)

    if (!company) {
      return httpResponse.BAD_REQUEST(res)
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return httpResponse.BAD_REQUEST(res, { error: 'No files uploaded' })
    }

    const updatedCompany = await updateCompanyFiles(company, req.files[0])

    return httpResponse.ACCEPTED(res, updatedCompany)
  } catch (error: any) {
    console.error('Error en updateCompanyFilesController:', error)
    if (error instanceof CustomError) {
      return httpResponse.ERROR(res, error.message)
    }
    return httpResponse.ERROR(res, { error: (error as any).message })
  }
}

const deleteCompanyFileController = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  try {
    const { companyId, fileId } = req.body
    const company = await findCompanyById(companyId)

    if (!company) {
      return httpResponse.BAD_REQUEST(res)
    }

    const updatedCompany = await deleteCompanyFile(company, fileId)

    return httpResponse.ACCEPTED(res, updatedCompany)
  } catch (error: any) {
    console.error('Error en deleteCompanyFileController:', error)
    if (error instanceof CustomError) {
      return httpResponse.ERROR(res, error.message)
    }
    return httpResponse.ERROR(res, { error: (error as any).message })
  }
}
export default {
  postCompany,
  updateCompanyFiles: updateCompanyFilesController,
  deleteCompanyFile: deleteCompanyFileController,
}
