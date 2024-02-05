const express = require('express')
const router = express.Router()
const { login, logout } = require('../controllers/authController')
const validate = require('../middleware/validate')
const {check} = require('express-validator')
const {verify, verifyAdmin} = require('../middleware/verify')
const {authenticateAdmin, createUser, updateUser} = require('../controllers/adminController')

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Authenticate Admin
 *     description: Authenticate admin based on valid credentials
 *     tags: [Admin]
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
 * /admin/authenticate:
 *   get:
 *     summary: Authenticate the admin user
 *     description: Authenticate the admin user with the provided credentials
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Admin user authenticated successfully
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token or insufficient permissions
 *       '403':
 *         description: Forbidden - User does not have the necessary permissions
 *       '500':
 *         description: Internal server error
 */
router.get('/authenticate', verify, verifyAdmin, authenticateAdmin)

/**
 * @swagger
 * /admin/createUser:
 *   post:
 *     summary: Create a new user
 *     description: Admin can create new users with relevant data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Invalid input data or missing required fields
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 *       '403':
 *         description: Forbidden - User does not have the necessary permissions
 *       '500':
 *         description: Internal server error
 */
router.post('/createUser',verify, verifyAdmin,
    check('email')
        .isEmail()
        .withMessage('Enter a valid email address')
        .normalizeEmail(),
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('First name is a mandatory field')
        .trim()
        .escape(),
    check('lastName')
        .not()
        .isEmpty()
        .withMessage('Last name is a mandatory field')
        .trim()
        .escape(),
    check('password')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password length is atleast 8 characters'),
    validate,
    createUser
)

/**
 * @swagger
 * /admin/editUser:
 *   post:
 *     summary: Edit/update an existing user
 *     description: Admin can edit/update an existing user with relevant data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Invalid input data or missing required fields
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 *       '403':
 *         description: Forbidden - User does not have the necessary permissions
 *       '500':
 *         description: Internal server error
 */
router.post('/editUser',verify, verifyAdmin,
    check('email')
        .isEmail()
        .withMessage('Enter a valid email address')
        .normalizeEmail(),
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('First name is a mandatory field')
        .trim()
        .escape(),
    check('lastName')
        .not()
        .isEmpty()
        .withMessage('Last name is a mandatory field')
        .trim()
        .escape(),
    check('password')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password length is atleast 8 characters'),
    validate,
    updateUser
)

/**
 * @swagger
 * /admin/logout:
 *   get:
 *     summary: Logout the admin user
 *     description: Logs out the admin user who's already logged in
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Admin user logged out successfully
 *       '204':
 *         description: No content found
 *       '500':
 *         description: Internal server error
 */
router.get('/logout', verify, logout)

module.exports = router