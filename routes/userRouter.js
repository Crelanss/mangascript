const Router = require('express')

const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

const router = new Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.isAuth)
router.get('/orders', checkRole('user'), userController.getOrders)
router.put('/', checkRole('user'), userController.updateUserData)


module.exports = router