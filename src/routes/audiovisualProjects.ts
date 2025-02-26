import { Router } from 'express'
import verifyToken from '../middlewares/verifyToken'
import uploadTempFiles from '../middlewares/multer'
import audiovisualProjectController from '../controllers/audiovisualProjectsController'

const audiovisualProjectsRouter = Router()

audiovisualProjectsRouter.get('/', audiovisualProjectController.getProjects)
audiovisualProjectsRouter.post(
  '/',
  verifyToken,
  audiovisualProjectController.postProject,
)
audiovisualProjectsRouter.get('/:id', audiovisualProjectController.getProject)
audiovisualProjectsRouter.put(
  '/files/delete',
  verifyToken,
  audiovisualProjectController.deleteProjectFiles,
)
audiovisualProjectsRouter.put(
  '/files',
  verifyToken,
  uploadTempFiles.any(),
  audiovisualProjectController.updateProjectFiles,
)
audiovisualProjectsRouter.put(
  '/edit',
  verifyToken,
  audiovisualProjectController.updateProject,
)
audiovisualProjectsRouter.delete(
  '/:id',
  verifyToken,
  audiovisualProjectController.deleteProject,
)

export default audiovisualProjectsRouter
