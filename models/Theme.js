const SQ = require('sequelize');
const { db } = require('../index');
const assign = require('assign-deep');

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

        assets: {
            type: SQ.TEXT,
            allowNull: false,
            get() {
                const d = this.getDataValue('assets');
                return JSON.parse(d);
            },
            set(assets) {
                this.setDataValue('assets', JSON.stringify(assets, null, 4));
            }
        }
    },
    {
        tableName: 'theme'
    }
);

Theme.belongsTo(Theme, { foreignKey: 'extend' });

/*
 * retreive "flattened" theme data, which is the theme data
 * with all data of "extended" themes merged into it.
 */
Theme.prototype.getFlatThemeData = async function() {
    let theme = this;
    const data = [theme.get('data')];
    while (theme.get('extend')) {
        theme = await Theme.findByPk(theme.get('extend'));
        data.push(theme.get('data'));
    }
    let flat = {};
    while (data.length) {
        flat = assign(flat, data.pop());
    }
    return flat;
};

module.exports = Theme;
