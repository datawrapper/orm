const SQ = require('sequelize');
const {db, token_salt} = require('../index');
const crypto = require('crypto');

const AccessToken = db.define('access_token', {

    id: {
        type:SQ.INTEGER,
        primaryKey:true,
        autoIncrement: true,
    },

    type: SQ.STRING(64),
    token: SQ.STRING(128),
    last_used_at: SQ.DATE,
    data: SQ.JSON

}, {
    tableName: 'access_token',
});

// Adding a class level method
AccessToken.newToken = async function({user_id, type, data}) {
    return await AccessToken.create({
        user_id,
        type,
        data: data || {},
        token: createRandomToken()
    });
};

const User = require('./User');
AccessToken.belongsTo(User);

AccessToken.sync();

module.exports = AccessToken;

function createRandomToken() {
    return crypto.createHmac("sha256", token_salt)
        .update(`${Math.random()*Math.random()}/${new Date()}`)
        .digest()
        .toString('base64');
}
