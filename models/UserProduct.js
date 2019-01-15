const SQ = require('sequelize');
const { db } = require('../index');

const UserProduct = db.define(
    'user_product',
    {
        created_by_admin: {
            type: SQ.BOOLEAN,
            defaultValue: true
        },

        changes: SQ.TEXT,

        expires: SQ.DATE
    },
    {
        tableName: 'user_product',
        timestamps: false
    }
);

const User = require('./User');
const Product = require('./Product');

User.belongsToMany(Product, {
    through: UserProduct,
    timestamps: false
});

Product.belongsToMany(User, {
    through: UserProduct,
    timestamps: false
});

module.exports = UserProduct;
