const {Author} = require('../models/models')
const ApiError = require('../error/ApiError')

class AuthorController {
    async create(req, res, next) {
        try {
            const {first_name, last_name} = req.body
            const author = await Author.create({first_name, last_name})
            return res.json({author})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const authors = await Author.findAll()
            return res.json({authors})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new AuthorController()