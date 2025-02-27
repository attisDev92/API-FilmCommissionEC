import { Router } from 'express'
import verifyToken from '../middlewares/verifyToken'
import locationsController from '../controllers/locationsController'
import uploadTempFiles from '../middlewares/multer'

const locationsRouter = Router()

locationsRouter.get('/', locationsController.getLocations)
locationsRouter.post('/', verifyToken, locationsController.postLocation)
locationsRouter.get('/:id', locationsController.getLocation)
locationsRouter.put(
  '/files/delete',
  verifyToken,
  locationsController.deleteLocationFile,
)
locationsRouter.put(
  '/files',
  verifyToken,
  uploadTempFiles.any(),
  locationsController.updateLocationFiles,
)
locationsRouter.put('/edit', verifyToken, locationsController.updateLocation)
locationsRouter.delete('/:id', verifyToken, locationsController.deleteLocation)
export default locationsRouter
