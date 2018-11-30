const SQ = require('sequelize');
const {db} = require('../index');
const crypto = require('crypto');

const AuthToken = db.define('auth_token', {

    id: {
        type:SQ.INTEGER,
        primaryKey:true,
        autoIncrement: true,
    },

    token: SQ.STRING(128),
    comment: SQ.STRING(255),
    last_used_at: SQ.DATE,

}, {
    tableName: 'auth_token',
});

// Adding a class level method
AuthToken.newToken = async function({user_id, type, comment}) {
    return await AuthToken.create({
        user_id,
        comment,
        token: crypto.randomBytes(32).toString('base64')
    });
};

const User = require('./User');
AuthToken.belongsTo(User);

module.exports = AuthToken;

