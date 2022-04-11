const Router = require('express')
const router = new Router()

const cartOrderController = require('../controllers/cartOrderController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('user'), cartOrderController.create)
router.get('/', cartOrderController.getAll)


module.exports = router