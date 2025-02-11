import { Router } from 'express'
import verifyToken from '../middlewares/verifyToken'
import companyController from '../controllers/companyController'
import uploadTempFiles from '../middlewares/multer'

const companyRouter = Router()

companyRouter.put(
  '/files/delete',
  verifyToken,
  companyController.deleteCompanyFile,
)
companyRouter.put(
  '/files',
  verifyToken,
  uploadTempFiles.any(),
  companyController.updateCompanyFiles,
)
companyRouter.get('/user', verifyToken, companyController.getUserCompanies)
companyRouter.get('/', companyController.getCompanies)
companyRouter.post('/', verifyToken, companyController.postCompany)

export default companyRouter
