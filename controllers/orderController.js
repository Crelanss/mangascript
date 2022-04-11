const {Order} = require('../models/models')
const ApiError = require('../error/ApiError')

class orderController {
    async create(req, res, next) {
        try {
            const {date_ordered} = req.body
            const order = await Order.create({date_ordered})

            return res.json({order})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        
    }
}

module.exports = new orderController()