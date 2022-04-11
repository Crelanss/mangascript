const jwt = require('jsonwebtoken')

const {CartOrder, Order, Manga} = require('../models/models')
const ApiError = require('../error/ApiError')

class cartOrderController {
    async create(req, res, next) {
        try{
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            let {mangas, date_ordered} = req.body
            const order = await Order.create({date_ordered})
            let cartOrders = []

            const findManga = async (id) => {
                return await Manga.findOne({
                    where: {
                        id: id
                    }
                })
            }

            mangas = JSON.parse(mangas)
            for (const m of mangas) {
                let mangaId = await findManga(m.mangaId)

                const cartOrder = await CartOrder.create({
                    userId: decoded.id,
                    orderId: order.id,
                    mangaId: mangaId.dataValues.id,
                    quantity: m.quantity * 1
                })
                cartOrders.push(cartOrder)
            }

            return res.json({cartOrders})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {

    }
}

module.exports = new cartOrderController()
