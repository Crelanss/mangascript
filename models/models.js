const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    first_name: {type: DataTypes.STRING, allowNull: false},
    last_name: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"}
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    date_ordered: {type: DataTypes.DATE, allowNull: false}
})

const CartOrder = sequelize.define('cart_order', {
    orderId: {type: DataTypes.INTEGER, primaryKey: true},
    mangaId: {type: DataTypes.INTEGER, primaryKey: true},
    userId: {type: DataTypes.INTEGER, primaryKey: true},
    quantity: {type: DataTypes.INTEGER},
})

const Manga = sequelize.define('manga', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    img: {type: DataTypes.STRING, allowNull: false},
    in_stock: {type: DataTypes.BOOLEAN, allowNull: false},
    release_year: {type: DataTypes.INTEGER, allowNull: false},
})

const Author = sequelize.define('author', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    first_name: {type: DataTypes.STRING, allowNull: false},
    last_name: {type: DataTypes.STRING, allowNull: false},
})

const GenreManga = sequelize.define('genre_manga', {

})
const Genre = sequelize.define('genre', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
})

const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false}
})

User.hasMany(CartOrder, {as: 'orders'})
CartOrder.belongsTo(User)

Order.hasMany(CartOrder)
CartOrder.belongsTo(Order)

Manga.hasMany(CartOrder,)
CartOrder.belongsTo(Manga)

User.hasMany(Rating)
Rating.belongsTo(User)

Manga.hasMany(Rating)
Rating.belongsTo(Manga)

Manga.belongsToMany(Genre, {through: GenreManga})
Genre.belongsToMany(Manga, {through: GenreManga})

Author.hasMany(Manga)
Manga.belongsTo(Author)

module.exports = {
    User,
    Manga,
    Order,
    CartOrder,
    Genre,
    GenreManga,
    Rating,
    Author
}








