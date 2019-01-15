const { db } = require('../index');

const ProductPlugin = db.define(
    'product_plugin',
    {},
    {
        tableName: 'product_plugin',
        timestamps: false
    }
);

const Plugin = require('./Plugin');
const Product = require('./Product');

Plugin.belongsToMany(Product, {
    through: ProductPlugin,
    timestamps: false
});

Product.belongsToMany(Plugin, {
    through: ProductPlugin,
    timestamps: false
});

module.exports = ProductPlugin;
