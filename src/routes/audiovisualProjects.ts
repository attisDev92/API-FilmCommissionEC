import { Router } from 'express'
import verifyToken from '../middlewares/verifyToken'
import uploadTempFiles from '../middlewares/multer'
import audiovisualProjectController from '../controllers/audiovisualProjectsController'

const audiovisualProjectsRouter = Router()

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags: [Projects]
 *     summary: Get all projects
 *     description: Retrieve a list of all audiovisual projects
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AudiovisualProject'
 */
audiovisualProjectsRouter.get('/', audiovisualProjectController.getProjects)

/**
 * @swagger
 * /api/projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create a new project
 *     description: Create a new audiovisual project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AudiovisualProject'
 *     responses:
 *       201:
 *         description: Project created successfully
 *       401:
 *         description: Unauthorized
 */
audiovisualProjectsRouter.post(
  '/',
  verifyToken,
  audiovisualProjectController.postProject,
)

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project by ID
 *     description: Retrieve a specific project by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AudiovisualProject'
 *       404:
 *         description: Project not found
 */
audiovisualProjectsRouter.get('/:id', audiovisualProjectController.getProject)

/**
 * @swagger
 * /api/projects/files/delete:
 *   put:
 *     tags: [Projects]
 *     summary: Delete project files
 *     description: Delete files associated with a project
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
audiovisualProjectsRouter.put(
  '/files/delete',
  verifyToken,
  audiovisualProjectController.deleteProjectFiles,
)

/**
 * @swagger
 * /api/projects/files:
 *   put:
 *     tags: [Projects]
 *     summary: Update project files
 *     description: Upload or update files associated with a project
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
audiovisualProjectsRouter.put(
  '/files',
  verifyToken,
  uploadTempFiles.any(),
  audiovisualProjectController.updateProjectFiles,
)

/**
 * @swagger
 * /api/projects/edit:
 *   put:
 *     tags: [Projects]
 *     summary: Update project
 *     description: Update project information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AudiovisualProject'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       401:
 *         description: Unauthorized
 */
audiovisualProjectsRouter.put(
  '/edit',
  verifyToken,
  audiovisualProjectController.updateProject,
)

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     tags: [Projects]
 *     summary: Delete project
 *     description: Delete a project by its ID
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
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
audiovisualProjectsRouter.delete(
  '/:id',
  verifyToken,
  audiovisualProjectController.deleteProject,
)

export default audiovisualProjectsRouter
