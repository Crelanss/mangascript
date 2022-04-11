const {Genre} = require('../models/models')
const ApiError = require('../error/ApiError')

class genreController {
    async create(req, res) {
        const {name} = req.body
        const genre = await Genre.create({name})
        return res.json({message: genre})
    }

    async getAll(req, res) {
        const genres = await Genre.findAll()
        return res.json(genres)
    }
}

module.exports = new genreController()
