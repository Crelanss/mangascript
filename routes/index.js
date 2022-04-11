const Router = require('express')
const router = new Router()
const authorRouter = require('./authorRouter')
const userRouter = require('./userRouter')
const mangaRouter = require('./mangaRouter')
const ratingRouter = require('./ratingRouter')
const orderRouter = require('./orderRouter')
const genreRouter = require('./genreRouter')
const cartOrderRouter = require('./cartOrderRouter')

router.use('/user', userRouter)
router.use('/author', authorRouter)
router.use('/manga', mangaRouter)
router.use('/order', orderRouter)
router.use('/genre', genreRouter)
router.use('/rating', ratingRouter)
router.use('/cartorder', cartOrderRouter)

module.exports = router