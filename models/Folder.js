const SQ = require('sequelize');
const {db} = require('../index');

const Folder = db.define('folder', {

    id: {
        type:SQ.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        field: 'folder_id'
    },

    name: {
        type: SQ.STRING,
        field: 'folder_name'
    }

}, {
    timestamps: false,
    tableName: 'folder'
});

Folder.belongsTo(Folder, {
    as: 'parent',
    foreignKey: 'parent_id',
});

// const User = require('./User');
const Team = require('./Team');

// Folder.belongsTo(User, { foreignKey: 'user_id', });

Folder.belongsTo(Team, { foreignKey: 'org_id', });

module.exports = Folder;
