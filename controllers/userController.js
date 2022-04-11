const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {User, CartOrder} = require('../models/models')
const ApiError = require('../error/ApiError')

const generateJwt = (id, email, first_name, last_name, role) => {
    return jwt.sign(
        {id: id, email, first_name, last_name, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        try {
            const {email, first_name, last_name, role, password} = req.body
            if (!email || !password) {
                return next(ApiError.badRequest('Некорректно введенные данные'))
            }

            if (email !== 'frostycrelan84@gmail.com' && role === 'administrator') {
                return next(ApiError.badRequest('Вы не можете зарегистрироваться как админ'))
            }

            const candidate = await User.findOne(
                {
                    where: {
                        email: email
                    }
                }
            )
            if (candidate) {
                return next(ApiError.badRequest('Такой пользователь сущетсвует'))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({
                email: email,
                password: hashPassword,
                role: role,
                first_name,
                last_name
            })
            const token = generateJwt(user.id, email, first_name, last_name, role)

            return res.json({token})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne(
            {
                where: {
                    email: email
                }
            }
        )
        if (!user) {
            return next(ApiError.badRequest('Неверно введена почта'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Неверно введен пароль'))
        }
        const token = generateJwt(user.id, user.email, user.first_name, user.last_name, user.role)

        return res.json({token})
    }

    async isAuth(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.first_name, req.user.last_name, req.user.role)
        return res.json({token})
    }

    async getOrders(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const userOrders = await User.findAll({
                where: {
                    id: decoded.id
                },
                include: [{
                    model: CartOrder,
                    as: 'orders'
                }]
            })

            return res.json({userOrders})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async updateUserData(req, res, next) {
        try {
            const {email, last_name, first_name} = req.body
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            const candidate = await User.findOne(
                {
                    where: {
                        email: email
                    }
                }
            )
            if (candidate) {
                return next(ApiError.badRequest('email занят'))
            }

            const oldUser = await User.findOne({
                where: {
                    id: decoded.id
                }
            })
            await User.update({
                    id: oldUser.id,
                    email: email,
                    password: oldUser.password,
                    role: oldUser.role,
                    first_name: first_name,
                    last_name: last_name
                },
                {
                    where: {
                        id: oldUser.id
                    }
                })

            return res.send('Пользователь обновлен')

        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UserController()