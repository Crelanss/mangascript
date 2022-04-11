const uuid = require('uuid')
const path = require('path')

const {Manga, Genre, GenreManga} = require('../models/models')
const ApiError = require('../error/ApiError')

const getFileExtension = (fileName) => {
    return (fileName.split('.'))
}

class mangaController {
    async create(req, res, next) {
        try {
            let {name, price, release_year, authorId, genres, description, in_stock} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + `.${getFileExtension(req.files.img.name)[1]}`
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const manga = await Manga.create({
                name,
                price,
                authorId,
                release_year,
                description,
                img: fileName,
                in_stock
            })

            genres = JSON.parse(genres)
            for (const g of genres) {
                let genreId = await Genre.findAll({
                    where: {
                        name: g
                    }
                })
                await GenreManga.create({
                    mangaId: manga.id,
                    genreId: genreId[0].dataValues.id
                })
            }

            return res.json({manga})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res, next) {
        try {
            let {release_year, genre, limit, page} = req.query
            page = page || 1
            limit = limit || 9
            let offset = limit * page - limit
            let mangas
            if (!release_year && !genre) {
                mangas = await Manga.findAndCountAll({
                    limit, offset,
                    include: [{
                        model: Genre,
                        as: 'genres'
                    }]
                })
            }

            if (release_year && !genre) {
                mangas = await Manga.findAndCountAll({
                    where: {
                        release_year: release_year
                    },
                    include: [{
                        model: Genre,
                        as: 'genres',
                    }],
                    offset,
                    page
                })
            }

            if (!release_year && genre) {
                mangas = await Manga.findAndCountAll({
                    include: [{
                        model: Genre,
                        as: 'genres',
                        where: {
                            name: genre
                        }
                    }],
                    offset,
                    page
                })
            }

            if (release_year && genre) {
                mangas = await Manga.findAndCountAll({
                    where: {
                        release_year: release_year
                    },
                    include: [{
                        model: Genre,
                        as: 'genres',
                        where: {
                            name: genre
                        }
                    }],
                    offset,
                    page
                })
            }


            return res.json({mangas})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }

    }

    async getOne(req, res, next) {
        try {
            const {name} = req.params
            const manga = await Manga.findOne(
                {
                    where: {
                        name: name,
                    },
                    include: [{
                        model: Genre,
                        as: 'genres'
                    }]
                }
            )

            return res.json({manga})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }

    }

    async delete(req, res, next) {
        const {name} = req.params

        try {
            await Manga.destroy({
                where: {
                    name: name
                }
            })
            res.send(`Манга ${name} удалена`)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async updateMangaInfo(req, res, next) {
        try {
            const {name} = req.params
            const manga = await Manga.findOne({
                where: {
                    name: name
                }
            })

            if(!manga) {
                return next(ApiError.badRequest('Манга не найдена'))
            }

            let {price, description, in_stock} = req.body

            const {img} = req.files
            let fileName = uuid.v4() + `.${getFileExtension(req.files.img.name)[1]}`
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            await Manga.update({
                    id: manga.id,
                    name: name,
                    price: price,
                    authorId: manga.authorId,
                    release_year: manga.release_year,
                    description: description,
                    img: fileName,
                    in_stock: in_stock
                },
                {
                    where: {
                        id: manga.id
                    }
                })

            return res.send('Манга обновлена')
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new mangaController()