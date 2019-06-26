const SQ = require('sequelize');
const { db } = require('../index');
const generate = require('nanoid/generate');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/*
 * this model is deprecated, we'll switch to AccessToken soons
 */
const AuthToken = db.define(
    'auth_token',
    {
        id: {
            type: SQ.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: SQ.INTEGER,
        token: SQ.STRING(128),
        comment: SQ.STRING(255),
        last_used_at: SQ.DATE
    },
    {
        tableName: 'auth_token'
    }
);

// Adding a class level method
AuthToken.newToken = async function({ user_id, comment }) {
    return AuthToken.create({
        user_id,
        comment,
        token: generate(alphabet, 32)
    });
};

const User = require('./User');
AuthToken.belongsTo(User);

module.exports = AuthToken;
