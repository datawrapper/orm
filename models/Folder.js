const SQ = require('sequelize');
const { db } = require('../index');

const Folder = db.define(
    'folder',
    {
        id: {
            type: SQ.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'folder_id' // todo: rename db column
        },

        name: {
            type: SQ.STRING,
            field: 'folder_name' // todo: rename db column
        }
    },
    {
        timestamps: false,
        tableName: 'folder'
    }
);

Folder.belongsTo(Folder, { as: 'parent' });
Folder.hasMany(Folder, { as: 'children', foreignKey: 'parent_id' });

module.exports = Folder;
