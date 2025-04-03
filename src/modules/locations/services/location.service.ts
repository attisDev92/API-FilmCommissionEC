import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../../config/firebase.config'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import Location from '../schemas/Location'
import { CustomError, ErrorsMessage } from '../../../shared/CustomError'
import { HttpStatus } from '../../../shared/HttpResponse'
import { LocationTypes } from '../interfaces/location.interface'
import User from '../../users/schemas/User'
import path from 'path'
import { ObjectId } from 'mongoose'
import config from '../../../config/env.config'

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export const findLocationById = async (id: string) => {
  try {
    const location = await Location.findById(id)
    return location
  } catch (error) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.NOT_EXIST)
  }
}

export const fetchLocations = async () => {
  const locations = await Location.find({})

  if (!locations) {
    throw new CustomError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorsMessage.SERVER_ERROR,
    )
  }

  return locations
}

export const createLocation = async (locationToCreate: LocationTypes) => {
  const user = await User.findById(locationToCreate.userId)

  if (!user) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  const isLocationExist = await Location.findOne({
    name: locationToCreate.name,
  })

  if (isLocationExist) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.INVALID_DATA)
  }

  const location = new Location(locationToCreate)
  await location.save()

  user.locations = user.locations
    ? user.locations.concat(location.id)
    : [location.id]

  await user.save()
  return location
}

export const updateLoction = async (locationToUpdate: LocationTypes) => {
  const location = await Location.findById(locationToUpdate.id)

  if (!location) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  Object.keys(locationToUpdate).forEach(key => {
    const typedKey = key as keyof LocationTypes
    if (locationToUpdate[typedKey] !== undefined) {
      location[typedKey] = locationToUpdate[typedKey]
    }
  })

  await location.save()
  return location
}

export const updateLocationFiles = async (location: any, file: any) => {
  try {
    const fileExtension = path.extname(file.originalname)
    const fileName = `${config.firebaseStorage}/${location.name.replace(/ /g, '_')}/${file.fieldname}_${Date.now()}${fileExtension}`
    const storageRef = ref(storage, fileName)

    if (location.photos && location.photos.length >= 10) {
      throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.INVALID_DATA)
    }

    const snapshot = await uploadBytes(storageRef, file.buffer)
    const downloadUrl = await getDownloadURL(snapshot.ref)
    location.photos.push({ url: downloadUrl })

    await location.save()
    return location
  } catch (error: any) {
    throw error
  }
}

export const deleteLocationFile = async (location: any, fileId: string) => {
  try {
    let fileDeleted = false

    const photoIndex: number = location.photos.findIndex(
      (photo: { _id: any }) => photo._id && photo._id.toString() === fileId,
    )
    if (photoIndex !== -1) {
      try {
        const photoPath = location.photos[photoIndex].url
          .split('/o/')[1]
          .split('?')[0]
        const photoRef = ref(storage, decodeURIComponent(photoPath))
        await deleteObject(photoRef)
        location.photos.splice(photoIndex, 1)
        fileDeleted = true
      } catch (error: any) {
        throw error
      }
    }

    if (!fileDeleted) {
      throw new CustomError(400, ErrorsMessage.NOT_EXIST)
    }

    await location.save()
    return location
  } catch (error: any) {
    throw error
  }
}

export const destroyLocation = async (locationId: string) => {
  const location = await Location.findById(locationId)

  if (!location) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  await Location.deleteOne({ _id: locationId })
}
