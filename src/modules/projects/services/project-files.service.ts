import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getStorage,
} from 'firebase/storage'
import path from 'path'
import config from '../../../config/env.config'
import { CustomError, ErrorsMessage } from '../../../shared/CustomError'
import { HttpStatus } from '../../../shared/HttpResponse'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../../config/firebase.config'

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)

export const updateProjectFiles = async (project: any, file: any) => {
  try {
    const fileExtension = path.extname(file.originalname)
    const fileName = `${config.firebaseStorage}/${project.name.replace(/ /g, '_')}/${file.fieldname}_${Date.now()}${fileExtension}`
    const storageRef = ref(storage, fileName)

    const uploadFile = async () => {
      const snapshot = await uploadBytes(storageRef, file.buffer)
      return await getDownloadURL(snapshot.ref)
    }

    const deleteOldFile = async (fileUrl: string) => {
      if (fileUrl) {
        try {
          const oldFilePath = fileUrl.split('/o/')[1].split('?')[0]
          const oldFileRef = ref(storage, decodeURIComponent(oldFilePath))
          await deleteObject(oldFileRef)
        } catch (error: any) {
          console.error('Error al eliminar el archivo antiguo:', error.message)
          throw error
        }
      }
    }

    if (file.fieldname === 'directorPhoto') {
      if (project.directorPhoto && project.directorPhoto.url) {
        await deleteOldFile(project.directorPhoto.url)
      }
      const downloadUrl = await uploadFile()
      project.directorPhoto = { url: downloadUrl }
    }

    if (file.fieldname === 'producerPhoto') {
      if (project.producerPhoto && project.producerPhoto.url) {
        await deleteOldFile(project.producerPhoto.url)
      }
      const downloadUrl = await uploadFile()
      project.producerPhoto = { url: downloadUrl }
    }

    if (file.fieldname === 'afiche') {
      if (project.afiche && project.afiche.url) {
        await deleteOldFile(project.afiche.url)
      }
      const downloadUrl = await uploadFile()
      project.afiche = { url: downloadUrl }
    }

    if (file.fieldname === 'dossier') {
      if (project.dossier && project.dossier.url) {
        await deleteOldFile(project.dossier.url)
      }
      const downloadUrl = await uploadFile()
      project.dossier = { url: downloadUrl }
    }

    if (file.fieldname === 'stills') {
      if (project.stills && project.stills.length >= 10) {
        throw new CustomError(
          HttpStatus.BAD_REQUEST,
          ErrorsMessage.INVALID_DATA,
        )
      }
      const downloadUrl = await uploadFile()
      if (!project.stills) project.stills = []
      project.stills.push({ url: downloadUrl })
    }

    await project.save()
    return project
  } catch (error) {
    throw error
  }
}

export const deleteProjectFile = async (project: any, fileId: string) => {
  try {
    let fileDeleted = false

    const deleteFile = async (fileUrl: string) => {
      if (fileUrl) {
        const filePath = fileUrl.split('/o/')[1].split('?')[0]
        const fileRef = ref(storage, decodeURIComponent(filePath))
        await deleteObject(fileRef)
        return true
      }
      return false
    }

    if (
      project.directorPhoto &&
      project.directorPhoto.url &&
      project.directorPhoto._id &&
      project.directorPhoto._id.toString() === fileId
    ) {
      await deleteFile(project.directorPhoto.url)
      project.directorPhoto = { url: '' }
      fileDeleted = true
    }

    if (
      project.producerPhoto &&
      project.producerPhoto.url &&
      project.producerPhoto._id &&
      project.producerPhoto._id.toString() === fileId
    ) {
      await deleteFile(project.producerPhoto.url)
      project.producerPhoto = { url: '' }
      fileDeleted = true
    }

    if (
      project.afiche &&
      project.afiche.url &&
      project.afiche._id &&
      project.afiche._id.toString() === fileId
    ) {
      await deleteFile(project.afiche.url)
      project.afiche = { url: '' }
      fileDeleted = true
    }

    if (
      project.dossier &&
      project.dossier.url &&
      project.dossier._id &&
      project.dossier._id.toString() === fileId
    ) {
      await deleteFile(project.dossier.url)
      project.dossier = { url: '' }
      fileDeleted = true
    }

    const stillIndex = project.stills.findIndex(
      (still: { _id: any }) => still._id && still._id.toString() === fileId,
    )
    if (stillIndex !== -1) {
      await deleteFile(project.stills[stillIndex].url)
      project.stills.splice(stillIndex, 1)
      fileDeleted = true
    }

    if (!fileDeleted) {
      throw new CustomError(400, ErrorsMessage.NOT_EXIST)
    }

    await project.save()
    return project
  } catch (error) {
    throw error
  }
}
