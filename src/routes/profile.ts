import { Router } from 'express'
import verifyToken from '../middlewares/verifyToken'
import profileControllers from '../controllers/profileControllers'

const profileRouter = Router()

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags: [Profile]
 *     summary: Get user profile
 *     description: Retrieve the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 */
profileRouter.get('/', verifyToken, profileControllers.getProfile)

/**
 * @swagger
 * /api/profile:
 *   post:
 *     tags: [Profile]
 *     summary: Create or update user profile
 *     description: Create or update the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
profileRouter.post('/', verifyToken, profileControllers.postProfile)

export default profileRouter
