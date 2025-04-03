import { Router } from 'express'
import userControllers from '../controllers/userControllers'
import verifyToken from '../middlewares/verifyToken'
import verifyAdmin from '../middlewares/verifyAdmin'

const userRouter = Router()

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Register a new user in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 */
userRouter.post('/create', userControllers.createUser)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticate user and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
userRouter.post('/login', userControllers.login)

/**
 * @swagger
 * /api/users/login:
 *   get:
 *     tags: [Authentication]
 *     summary: Validate user token
 *     description: Check if the user's JWT token is valid
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 */
userRouter.get('/login', verifyToken, userControllers.validateLogin)

/**
 * @swagger
 * /api/users/auth/{code}:
 *   get:
 *     tags: [Authentication]
 *     summary: Get user from email token
 *     description: Validate email verification token and get user data
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token validated successfully
 *       400:
 *         description: Invalid token
 */
userRouter.get('/auth/:code', userControllers.getUserFromEmailToken)

/**
 * @swagger
 * /api/users/auth:
 *   post:
 *     tags: [Authentication]
 *     summary: Change user validation status
 *     description: Update user email verification status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Validation status updated
 *       400:
 *         description: Invalid request
 */
userRouter.post('/auth', userControllers.changevalidationUser)

/**
 * @swagger
 * /api/users/recover_pass:
 *   post:
 *     tags: [Authentication]
 *     summary: Recover user password
 *     description: Send password recovery email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Recovery email sent
 *       404:
 *         description: User not found
 */
userRouter.post('/recover_pass', userControllers.recoverUserPass)

/**
 * @swagger
 * /api/users/change_newpass:
 *   post:
 *     tags: [Authentication]
 *     summary: Change user password
 *     description: Update user password with new one
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *             required:
 *               - token
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid token or password
 */
userRouter.post('/change_newpass', userControllers.changeToNewPass)

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Retrieve list of all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
userRouter.get('/', verifyToken, verifyAdmin, userControllers.getUsers)

export default userRouter
