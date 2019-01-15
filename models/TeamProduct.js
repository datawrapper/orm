const SQ = require('sequelize');
const { db } = require('../index');

const TeamProduct = db.define(
    'team_product',
    {
        created_by_admin: {
            type: SQ.BOOLEAN,
            defaultValue: true
        },

        changes: SQ.TEXT,

        expires: SQ.DATE
    },
    {
        tableName: 'organization_product',
        timestamps: false
    }
);

const Team = require('./Team');
const Product = require('./Product');

Team.belongsToMany(Product, {
    through: TeamProduct,
    foreignKey: 'organization_id',
    timestamps: false
});

Product.belongsToMany(Team, {
    through: TeamProduct,
    timestamps: false
});

module.exports = TeamProduct;
