const SQ = require('sequelize');
const { db } = require('../index');
const generate = require('nanoid/generate');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/*
 * this model is deprecated, we'll switch to AccessToken some day
 */
const ChartAccessToken = db.define(
    'chart_access_token',
    {
        id: {
            type: SQ.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        token: SQ.STRING(128)
    },
    {
        tableName: 'chart_access_token'
    }
);

// Adding a class level method
ChartAccessToken.newToken = async function({ chart_id }) {
    return ChartAccessToken.create({
        chart_id,
        token: generate(alphabet, 32)
    });
};

const Chart = require('./Chart');
ChartAccessToken.belongsTo(Chart, { foreignKey: 'chart_id' });

module.exports = ChartAccessToken;
