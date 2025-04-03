import { Router } from 'express'
import verifyToken from '../middlewares/verifyToken'
import companyController from '../controllers/companyController'
import uploadTempFiles from '../middlewares/multer'

const companyRouter = Router()

/**
 * @swagger
 * /api/companies/user:
 *   get:
 *     tags: [Companies]
 *     summary: Get user's companies
 *     description: Retrieve all companies associated with the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       401:
 *         description: Unauthorized
 */
companyRouter.get('/user', verifyToken, companyController.getUserCompanies)

/**
 * @swagger
 * /api/companies:
 *   get:
 *     tags: [Companies]
 *     summary: Get all companies
 *     description: Retrieve a list of all companies
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */
companyRouter.get('/', companyController.getCompanies)

/**
 * @swagger
 * /api/companies:
 *   post:
 *     tags: [Companies]
 *     summary: Create a new company
 *     description: Create a new company with the provided data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Company created successfully
 *       401:
 *         description: Unauthorized
 */
companyRouter.post('/', verifyToken, companyController.postCompany)

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Get company by ID
 *     description: Retrieve a specific company by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */
companyRouter.get('/:id', companyController.getCompany)

/**
 * @swagger
 * /api/companies/files/delete:
 *   put:
 *     tags: [Companies]
 *     summary: Delete company files
 *     description: Delete files associated with a company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: string
 *             required:
 *               - fileId
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       401:
 *         description: Unauthorized
 */
companyRouter.put(
  '/files/delete',
  verifyToken,
  companyController.deleteCompanyFile,
)

/**
 * @swagger
 * /api/companies/files:
 *   put:
 *     tags: [Companies]
 *     summary: Update company files
 *     description: Upload or update files associated with a company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files updated successfully
 *       401:
 *         description: Unauthorized
 */
companyRouter.put(
  '/files',
  verifyToken,
  uploadTempFiles.any(),
  companyController.updateCompanyFiles,
)

/**
 * @swagger
 * /api/companies/edit:
 *   put:
 *     tags: [Companies]
 *     summary: Update company
 *     description: Update company information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       401:
 *         description: Unauthorized
 */
companyRouter.put('/edit', verifyToken, companyController.updateCompany)

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     tags: [Companies]
 *     summary: Delete company
 *     description: Delete a company by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
companyRouter.delete('/:id', verifyToken, companyController.deleteCompany)

export default companyRouter
