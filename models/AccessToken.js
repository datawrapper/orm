const SQ = require('sequelize');
const { db } = require('../index');
const generate = require('nanoid/generate');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const AccessToken = db.define(
    'access_token',
    {
        id: {
            type: SQ.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        type: SQ.STRING(64),
        token: SQ.STRING(128),
        last_used_at: SQ.DATE,
        data: SQ.JSON
    },
    {
        tableName: 'access_token'
    }
);

// Adding a class level method
AccessToken.newToken = async function({ user_id, type, data }) {
    return AccessToken.create({
        user_id,
        type,
        data: data || {},
        token: generate(alphabet, 64)
    });
};

const User = require('./User');
AccessToken.belongsTo(User, { foreignKey: 'user_id' });

module.exports = AccessToken;
