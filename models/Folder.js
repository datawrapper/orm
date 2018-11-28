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
    tableName: 'folder'
});

Folder.belongsTo(Folder, {
    as: 'parent',
    foreignKey: 'parent_id',
});

module.exports = Folder;
