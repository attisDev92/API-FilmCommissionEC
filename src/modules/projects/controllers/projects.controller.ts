import { Request, Response } from 'express'
import { HttpResponse } from '../../../shared/HttpResponse'
import {
  AuthenticatedRequest,
  UserType,
} from '../../users/interfaces/user.interface'
import { AudiovisualProjectTypes } from '../interfaces/project.interfce'
import { ErrorsMessage, CustomError } from '../../../shared/CustomError'
import { MongooseError } from 'mongoose'
import {
  createProject,
  destroyProject,
  fetchProjets,
  findProjectById,
  updateProjectService,
} from '../services/project.service'
import {
  deleteProjectFile,
  updateProjectFiles,
} from '../services/project-files.service'
import { deleteProjectIdFromUser } from '../../users/services/users.service'

const httpResponse = new HttpResponse()

const getProject = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const { id } = req.params
  try {
    const response = await findProjectById(id)
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

const getProjects = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  try {
    const response = await fetchProjets()
    return httpResponse.OK(res, response)
  } catch (error: any) {
    if (
      error instanceof CustomError &&
      error.message === ErrorsMessage.SERVER_ERROR
    ) {
      return httpResponse.ERROR(res, error.message)
    }
    return httpResponse.ERROR(res, error.message)
  }
}

const postProject = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const { id } = req.userToken as Pick<UserType, 'id'>
  const { body } = req

  const projectToCreate: AudiovisualProjectTypes = {
    ...body,
    userId: id,
  }

  try {
    const response = await createProject(projectToCreate)
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

const updateProject = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const projectToUpdate = req.body
  try {
    const projectUpdated = await updateProjectService(projectToUpdate)
    return httpResponse.OK(res, projectUpdated)
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

const updateProjectFilesController = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  try {
    const { projectId } = req.body
    const project = await findProjectById(projectId)

    if (!project) {
      return httpResponse.BAD_REQUEST(res)
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return httpResponse.BAD_REQUEST(res, { error: 'No files uploaded' })
    }

    const updatedProject = await updateProjectFiles(project, req.files[0])
    return httpResponse.ACCEPTED(res, updatedProject)
  } catch (error: any) {
    console.error('Error en updateCompanyFilesController:', error)
    if (error instanceof CustomError) {
      return httpResponse.ERROR(res, error.message)
    }
    return httpResponse.ERROR(res, { error: (error as any).message })
  }
}

const deleteProjectFileController = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const { projectId, fileId } = req.body
  try {
    const project = await findProjectById(projectId)

    if (!project) {
      return httpResponse.BAD_REQUEST(res)
    }

    const updatedProject = await deleteProjectFile(project, fileId)
    return httpResponse.ACCEPTED(res, updatedProject)
  } catch (error) {
    console.error('Error en deleteCompanyFileController:', error)
    if (error instanceof CustomError) {
      return httpResponse.ERROR(res, error.message)
    }
    return httpResponse.ERROR(res, { error: (error as any).message })
  }
}

const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  const projectId = req.params.id
  const { id } = req.userToken as Pick<UserType, 'id'>

  try {
    await destroyProject(projectId)
    await deleteProjectIdFromUser(projectId, id.toString())
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
  getProject,
  getProjects,
  postProject,
  updateProject,
  updateProjectFiles: updateProjectFilesController,
  deleteProjectFiles: deleteProjectFileController,
  deleteProject,
}
