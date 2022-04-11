const Router = require('express')
const router = new Router()

const authorController = require('../controllers/authorController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('administrator'), authorController.create)
router.get('/', authorController.getAll)


module.exports = router