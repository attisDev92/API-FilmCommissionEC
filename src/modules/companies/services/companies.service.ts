import Company from '../schemas/Company'
import { CompanyTypes } from '../interfaces/company.interface'
import { CustomError, ErrorsMessage } from '../../../shared/CustomError'
import { HttpStatus } from '../../../shared/HttpResponse'
import User from '../../users/schemas/User'
import config from '../../../config/env.config'

import { initializeApp } from 'firebase/app'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import path from 'path'
import firebaseConfig from '../../../config/firebase.config'
import { ObjectId } from 'mongoose'

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export const findCompanyById = async (id: string) => {
  try {
    const company = await Company.findById(id)
    if (!company) {
      throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
    }
    return company
  } catch (error) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.NOT_EXIST)
  }
}

export const fetchCompanies = async () => {
  const companies = await Company.find({})

  if (!companies) {
    throw new CustomError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorsMessage.SERVER_ERROR,
    )
  }

  return companies
}

export const findUserCompanies = async (userId: ObjectId) => {
  const companies = await Company.find({ userId })
  if (!companies) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }
  return companies
}

export const createCompany = async (companyToCreate: CompanyTypes) => {
  const user = await User.findById(companyToCreate.userId)

  if (!user) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  const isCompanyExist = await Company.findOne({
    company: companyToCreate.company,
  })

  if (isCompanyExist) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.INVALID_DATA)
  }

  const company = new Company(companyToCreate)
  await company.save()

  user.companies = user.companies
    ? user.companies.concat(company.id)
    : [company.id]

  await user.save()
  return company
}

export const updateCompanyFiles = async (company: any, file: any) => {
  try {
    const fileExtension = path.extname(file.originalname)
    const fileName = `${config.firebaseStorage}/${company.company.replace(/ /g, '_')}/${file.fieldname}_${Date.now()}${fileExtension}`
    const storageRef = ref(storage, fileName)

    if (file.fieldname === 'logo') {
      if (company.logo && company.logo.url) {
        try {
          const oldLogoPath = company.logo.url.split('/o/')[1].split('?')[0]
          const oldLogoRef = ref(storage, decodeURIComponent(oldLogoPath))
          await deleteObject(oldLogoRef)
        } catch (error: any) {
          console.error('Error al eliminar el logo antiguo:', error.message)
          throw error
        }
      }
      const snapshot = await uploadBytes(storageRef, file.buffer)
      const downloadUrl = await getDownloadURL(snapshot.ref)
      company.logo = { url: downloadUrl }
    }

    if (file.fieldname === 'photo') {
      if (company.photos && company.photos.length >= 5) {
        throw new CustomError(
          HttpStatus.BAD_REQUEST,
          ErrorsMessage.INVALID_DATA,
        )
      }

      const snapshot = await uploadBytes(storageRef, file.buffer)
      const downloadUrl = await getDownloadURL(snapshot.ref)
      company.photos.push({ url: downloadUrl })
    }

    await company.save()
    return company
  } catch (error) {
    throw error
  }
}

export const deleteCompanyFile = async (company: any, fileId: string) => {
  try {
    let fileDeleted = false

    if (
      company.logo &&
      company.logo.url &&
      company.logo._id &&
      company.logo._id.toString() === fileId
    ) {
      try {
        const logoPath = company.logo.url.split('/o/')[1].split('?')[0]
        const logoRef = ref(storage, decodeURIComponent(logoPath))
        await deleteObject(logoRef)
        company.logo = { url: '' }
        fileDeleted = true
      } catch (error) {
        throw error
      }
    }

    const photoIndex: number = company.photos.findIndex(
      (photo: { _id: any }) => photo._id && photo._id.toString() === fileId,
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
      } catch (error) {
        throw error
      }
    }

    if (!fileDeleted) {
      throw new CustomError(400, ErrorsMessage.NOT_EXIST)
    }

    await company.save()
    return company
  } catch (error) {
    throw error
  }
}

export const updateCompanyServices = async (companyToUpdate: CompanyTypes) => {
  const company = await Company.findById(companyToUpdate.id)

  if (!company) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  Object.keys(companyToUpdate).forEach(key => {
    const typedKey = key as keyof CompanyTypes
    if (companyToUpdate[typedKey] !== undefined) {
      company[typedKey] = companyToUpdate[typedKey]
    }
  })

  await company.save()
  return company
}

export const destroyCompany = async (companyId: string) => {
  const company = await Company.findById(companyId)

  if (!company) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  await Company.deleteOne({ _id: companyId })
}
