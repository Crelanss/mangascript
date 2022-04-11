const Router = require('express')
const router = new Router()

const mangaController = require('../controllers/mangaController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('administrator'), mangaController.create)
router.get('/', mangaController.getAll)
router.get('/:name', mangaController.getOne)
router.delete('/:name', checkRole('administrator'), mangaController.delete)
router.put('/:name', checkRole('administrator'), mangaController.updateMangaInfo)


module.exports = router