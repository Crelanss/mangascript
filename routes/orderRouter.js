const Router = require('express')
const router = new Router()

const orderController = require('../controllers/orderController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('user'), orderController.create)
router.get('/', checkRole('user'), orderController.getAll)


module.exports = router