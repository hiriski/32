const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/auth.controller')
const GuestController = require('../controllers/guest.controller')
const ErrorHandler = require('../middlewares/error.middleware')
const AuthGuard = require('../middlewares/auth.middleware')
const schema = require('../validations/auth.validation')
const validate = require('../utils/validator.util')

router.post(
    '/register/send-code',
    validate(schema.sendRegisterCode),
    ErrorHandler(AuthController.sendRegisterCode)
)
router.post(
    '/register/check-code',
    validate(schema.checkRegisterCode),
    ErrorHandler(AuthController.checkRegisterCode)
)
router.post(
    '/register/verify-code',
    validate(schema.verifyRegisterCode),
    ErrorHandler(AuthController.verifyRegisterCode)
)
router.post(
    '/register',
    validate(schema.register),
    ErrorHandler(AuthController.register)
)
router.post(
    '/login',
    validate(schema.login),
    ErrorHandler(AuthController.login)
)
router.get('/user', AuthGuard, ErrorHandler(AuthController.getUser))
router.get('/sync', AuthGuard, ErrorHandler(AuthController.syncUser))
router.get('/logout', AuthGuard, ErrorHandler(AuthController.logout))
router.post(
    '/forgot-password/send-link',
    validate(schema.sendLinkForgotPassword),
    ErrorHandler(AuthController.sendLinkForgotPassword)
)
router.post(
    '/forgot-password/send-code',
    validate(schema.sendCodeForgotPassword),
    ErrorHandler(AuthController.sendCodeForgotPassword)
)
router.post(
    '/forgot-password/verify-code',
    validate(schema.verifyCodeForgotPassword),
    ErrorHandler(AuthController.verifyCodeForgotPassword)
)
router.post(
    '/reset-password',
    validate(schema.resetPassword),
    ErrorHandler(AuthController.resetPassword)
)

router.get('/guest/init', ErrorHandler(GuestController.init))

router.get('/guest/sync', AuthGuard, ErrorHandler(GuestController.syncGuest))

router.post(
    '/guest/register/sync-google',
    AuthGuard,
    ErrorHandler(AuthController.syncRegisterGoogle)
)

router.get('/guest', AuthGuard, ErrorHandler(GuestController.getGuest))

module.exports = router
