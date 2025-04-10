import AudiovisualProject from '../schemas/AudiovisualProject'
import { CustomError, ErrorsMessage } from '../../../shared/CustomError'
import { HttpStatus } from '../../../shared/HttpResponse'
import { AudiovisualProjectTypes } from '../interfaces/project.interfce'
import User from '../../users/schemas/User'

export const findProjectById = async (id: string) => {
  try {
    const project = await AudiovisualProject.findById(id)
    return project
  } catch (error) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.NOT_EXIST)
  }
}

export const fetchProjets = async () => {
  const projects = await AudiovisualProject.find({})

  if (!projects) {
    throw new CustomError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorsMessage.SERVER_ERROR,
    )
  }

  return projects
}

export const createProject = async (
  projectToCreate: AudiovisualProjectTypes,
) => {
  const user = await User.findById(projectToCreate.userId)

  if (!user) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  const isProjectExist = await AudiovisualProject.findOne({
    name: projectToCreate.name,
  })

  if (isProjectExist) {
    throw new CustomError(HttpStatus.BAD_REQUEST, ErrorsMessage.INVALID_DATA)
  }

  const project = new AudiovisualProject(projectToCreate)
  await project.save()

  user.audiovisualProjects = user.audiovisualProjects
    ? user.audiovisualProjects.concat(project.id)
    : [project.id]

  await user.save()
  return project
}

export const updateProjectService = async (
  projectToUpdate: AudiovisualProjectTypes,
) => {
  const project = await AudiovisualProject.findById(projectToUpdate.id)

  if (!project) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  Object.keys(projectToUpdate).forEach(key => {
    const typedKey = key as keyof AudiovisualProjectTypes
    if (projectToUpdate[typedKey] !== undefined) {
      project[typedKey] = projectToUpdate[typedKey]
    }
  })

  await project.save()
  return project
}

export const destroyProject = async (projectId: string) => {
  const project = await AudiovisualProject.findById(projectId)

  if (!project) {
    throw new CustomError(HttpStatus.NOT_FOUND, ErrorsMessage.NOT_EXIST)
  }

  await AudiovisualProject.deleteOne({ _id: projectId })
}
