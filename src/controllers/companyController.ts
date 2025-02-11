import { Response } from 'express'
import { HttpResponse } from '../shared/HttpResponse'
import { AuthenticatedRequest, UserType } from '../types/userTypes'
import { createCompany, findCompanyById } from '../services/companiesServices'
import { CompanyTypes } from '../types/companyTypes'
import { ErrorsMessage, CustomError } from '../shared/CustomError'
import mongoose from 'mongoose'

import { initializeApp } from 'firebase/app'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import path from 'path'
import config from '../config/envConfig'
import firebaseConfig from '../config/firebaseConfig'

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

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

    if (error instanceof mongoose.Error && error.name === 'ValidationError') {
      return httpResponse.BAD_REQUEST(res, ErrorsMessage.INVALID_DATA)
    }

    return httpResponse.ERROR(res, error.message)
  }
}

const updateCompanyFiles = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const { companyId } = req.body

  try {
    const company = await findCompanyById(companyId)

    if (!company) {
      return httpResponse.BAD_REQUEST(res)
    }

    if (!req.files || !Array.isArray(req.files)) {
      return httpResponse.BAD_REQUEST(res, { error: 'No files uploaded' })
    }
    const file = req.files[0]
    const fileExtension = path.extname(file.originalname)
    const fileName = `${config.firebaseStorage}/${company.company.replace(/ /g, '_')}/${file.fieldname}_${Date.now()}${fileExtension}`
    const storageRef = ref(storage, fileName)

    if (file.fieldname === 'logo') {
      if (company.logo.url) {
        try {
          const oldLogoPath = company.logo.url.split('/o/')[1].split('?')[0]
          const oldLogoRef = ref(storage, decodeURIComponent(oldLogoPath))
          await deleteObject(oldLogoRef)
        } catch (error: any) {
          console.error('Error al eliminar el logo antiguo:', error.message)
          return httpResponse.ERROR(res, { error: error.message })
        }
      }
      const snapshot = await uploadBytes(storageRef, file.buffer)
      const downloadUrl = await getDownloadURL(snapshot.ref)
      company.logo.url = downloadUrl
    }

    if (file.fieldname === 'photo') {
      if (company.photos.length >= 5) {
        return httpResponse.BAD_REQUEST(res, {
          error:
            'Se han guardado el número máximo de fotos, debe eliminar un elemento antes de subir uno nuevo',
        })
      }

      const snapshot = await uploadBytes(storageRef, file.buffer)
      const downloadUrl = await getDownloadURL(snapshot.ref)
      company.photos.push({ url: downloadUrl })
    }

    await company.save()
    httpResponse.ACCEPTED(res, company)
  } catch (error: any) {
    console.log(error)
    return httpResponse.ERROR(res, { error: error.message })
  }
}

const deleteCompanyFile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const { companyId, fileId } = req.body
  try {
    const company = await findCompanyById(companyId)
    if (!company) {
      return httpResponse.BAD_REQUEST(res)
    }

    let fileDeleted = false

    if (
      company.logo &&
      company.logo.url.trim() !== '' &&
      company?.logo?._id &&
      company.logo._id.toString() === fileId
    ) {
      try {
        const logoPath = company.logo.url.split('/o/')[1].split('?')[0]
        const logoRef = ref(storage, decodeURIComponent(logoPath))
        await deleteObject(logoRef)
        company.logo.url = ''
        fileDeleted = true
      } catch (error: any) {
        console.log(error)
        return httpResponse.ERROR(res, { error: error.message })
      }
    }

    const photoIndex = company.photos.findIndex(
      photo => photo._id && photo._id.toString() === fileId,
    )
    if (photoIndex !== -1) {
      try {
        const photoPath = company.photos[photoIndex].url
          .split('/o/')[1]
          .split('?')[0]
        const photoRef = ref(storage, decodeURIComponent(photoPath))
        await deleteObject(photoRef)
        company.photos.splice(photoIndex, 1)
        fileDeleted = true
      } catch (error: any) {
        console.log(error)
        return httpResponse.ERROR(res, { error: error.message })
      }
    }

    if (!fileDeleted) {
      return httpResponse.BAD_REQUEST(res, { error: 'Archivo no encontrado' })
    }

    await company.save()
    return httpResponse.ACCEPTED(res, company)
  } catch (error: any) {
    console.log(error)
  }
}
export default {
  postCompany,
  updateCompanyFiles,
  deleteCompanyFile,
}
