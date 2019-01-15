const SQ = require('sequelize');
const { db } = require('../index');

const Product = db.define(
    'product',
    {
        id: {
            type: SQ.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: SQ.STRING(512),
            allowNull: false
        },

        deleted: {
            type: SQ.BOOLEAN,
            defaultValue: false
        },

        priority: {
            type: SQ.INTEGER,
            defaultValue: 0
        },

        data: SQ.TEXT
    },
    {
        tableName: 'product'
    }
);

module.exports = Product;
