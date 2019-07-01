const SQ = require('sequelize');
const { db } = require('../index');

const Theme = db.define(
    'theme',
    {
        id: {
            type: SQ.STRING(128),
            primaryKey: true
        },

        title: SQ.STRING(128),

        data: {
            type: SQ.TEXT,
            allowNull: false,
            get() {
                const d = this.getDataValue('data');
                return JSON.parse(d);
            },
            set(data) {
                this.setDataValue('data', JSON.stringify(data, null, 4));
            }
        },

        less: SQ.TEXT,
        assets: SQ.TEXT
    },
    {
        tableName: 'theme'
    }
);

Theme.belongsTo(Theme, { foreignKey: 'extend' });

module.exports = Theme;
