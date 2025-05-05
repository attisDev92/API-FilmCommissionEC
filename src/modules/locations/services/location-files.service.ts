import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import path from 'path'
import config from '../../../config/env.config'
import { CustomError, ErrorsMessage } from '../../../shared/CustomError'
import { HttpStatus } from '../../../shared/HttpResponse'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../../config/firebase.config'
import { getStorage } from 'firebase/storage'

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)

export const updateLocationFiles = async (location: any, file: any) => {
  try {
    const fileExtension = path.extname(file.originalname)
    const fileName = `${config.firebaseStorage}/${location.name.replace(/ /g, '_')}/${file.fieldname}_${Date.now()}${fileExtension}`
    const storageRef = ref(storage, fileName)

    if (file.fieldname === 'photo') {
      if (location.photos && location.photos.length >= 15) {
        throw new CustomError(
          HttpStatus.BAD_REQUEST,
          ErrorsMessage.INVALID_DATA,
        )
      }
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
