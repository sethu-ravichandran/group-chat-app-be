const express = require('express')
const router = express.Router()
const { login, logout } = require('../controllers/authController')
const validate = require('../middleware/validate')
const {check} = require('express-validator')
const {verify, verifyAdmin} = require('../middleware/verify')
const {authenticateAdmin, createUser} = require('../controllers/adminController')

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

router.get('/authenticate', verify, verifyAdmin, authenticateAdmin)

router.get('/logout', verify, logout)

module.exports = router