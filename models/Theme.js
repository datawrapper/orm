const SQ = require('sequelize');
const {db} = require('../index');

const Theme = db.define('theme', {

    id: {
        type:SQ.STRING(128),
        primaryKey:true,
    },

    title: SQ.STRING(128),

    data: SQ.TEXT,
    less: SQ.TEXT,
    assets: SQ.TEXT,

}, {
    tableName: 'theme'
});

Theme.belongsTo(Theme, {foreignKey: 'extend'});

module.exports = Theme;
