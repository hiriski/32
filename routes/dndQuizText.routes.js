const express = require('express')
const router = express.Router()

const DNDQuizTextController = require('../controllers/dndQuizText.controller.js')
const ErrorHandler = require('../middlewares/error.middleware')
const schema = require('../validations/dndQuizText.validation')
const validate = require('../utils/validator.util')
const AuthGuard = require('../middlewares/auth.middleware')
const AdminMiddleware = require('../middlewares/admin.middleware')

// Fill heart routes
router.post(
    '/admin/quiz/dnd/text',
    validate(schema.save),
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(DNDQuizTextController.admin_create)
)

router.get(
    '/admin/quiz/dnd/text',
    validate(schema.save),
    AuthGuard,
    AdminMiddleware,
    ErrorHandler(DNDQuizTextController.admin_findAll)
)

module.exports = router
