import { Router } from 'express'
import verifyToken from '../../../middlewares/verifyToken'
import locationsController from '../controllers/locations.controller'
import uploadTempFiles from '../../../middlewares/multer'

const locationsRouter = Router()

/**
 * @swagger
 * /api/locations:
 *   get:
 *     tags: [Locations]
 *     summary: Get all locations
 *     description: Retrieve a list of all locations
 *     responses:
 *       200:
 *         description: List of locations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
locationsRouter.get('/', locationsController.getLocations)

/**
 * @swagger
 * /api/locations:
 *   post:
 *     tags: [Locations]
 *     summary: Create a new location
 *     description: Create a new location with the provided data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       201:
 *         description: Location created successfully
 *       401:
 *         description: Unauthorized
 */
locationsRouter.post('/', verifyToken, locationsController.postLocation)

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     tags: [Locations]
 *     summary: Get location by ID
 *     description: Retrieve a specific location by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 */
locationsRouter.get('/:id', locationsController.getLocation)

/**
 * @swagger
 * /api/locations/files/delete:
 *   put:
 *     tags: [Locations]
 *     summary: Delete location files
 *     description: Delete files associated with a location
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
locationsRouter.put(
  '/files/delete',
  verifyToken,
  locationsController.deleteLocationFile,
)

/**
 * @swagger
 * /api/locations/files:
 *   put:
 *     tags: [Locations]
 *     summary: Update location files
 *     description: Upload or update files associated with a location
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
locationsRouter.put(
  '/files',
  verifyToken,
  uploadTempFiles.any(),
  locationsController.updateLocationFiles,
)

/**
 * @swagger
 * /api/locations/edit:
 *   put:
 *     tags: [Locations]
 *     summary: Update location
 *     description: Update location information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       401:
 *         description: Unauthorized
 */
locationsRouter.put('/edit', verifyToken, locationsController.updateLocation)

/**
 * @swagger
 * /api/locations/{id}:
 *   delete:
 *     tags: [Locations]
 *     summary: Delete location
 *     description: Delete a location by its ID
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
 *         description: Location deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Location not found
 */
locationsRouter.delete('/:id', verifyToken, locationsController.deleteLocation)

export default locationsRouter
