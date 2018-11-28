const SQ = require('sequelize');
const {db} = require('../index');

const Team = db.define('team', {

    id: {
        type:SQ.STRING(128),
        primaryKey:true,
    },

    name: SQ.STRING,
    created_at: SQ.DATE,
    deleted: SQ.BOOLEAN,
    disabled: SQ.BOOLEAN,

    // default_theme:
    settings: SQ.TEXT,

}, {
    timestamps: false,
    tableName: 'organization'
});

module.exports = Team;
