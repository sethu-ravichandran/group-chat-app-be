const express = require('express')
const router = express.Router()
const { login, logout } = require('../controllers/authController')
const validate = require('../middleware/validate')
const {check} = require('express-validator')
const {verify} = require('../middleware/verify')
const {authenticateUser} = require('../controllers/userController')

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Authenticate User
 *     description: Authenticate user based on valid credentials
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful authentication
 *       '400':
 *         description: Invalid email or password
 *       '500':
 *         description: Internal server error
 */
router.post(
    '/login',
    check('email')
        .isEmail()
        .withMessage('Enter a valid email address')
        .normalizeEmail(),
    check('password').not().isEmpty(),
    validate,
    login
)

/**
 * @swagger
 * /user/authenticate:
 *   get:
 *     summary: Authenticate the user
 *     description: Authenticate the user with the provided credentials
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: The user authenticated successfully
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token or insufficient permissions
 *       '403':
 *         description: Forbidden - User does not have the necessary permissions
 *       '500':
 *         description: Internal server error
 */
router.get('/authenticate', verify, authenticateUser)

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout the user
 *     description: Logs out the user who's already logged in
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *       '204':
 *         description: No content found
 *       '500':
 *         description: Internal server error
 */
router.get('/logout', verify, logout)

module.exports = router