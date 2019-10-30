const ORM = require('../');
const UserData = require('../models/UserData');

module.exports.getUserData = async function(userId, key, _default = undefined) {
    const row = await UserData.findOne({
        user_id: userId,
        key
    });
    return row ? row.value : _default;
};

module.exports.setUserData = async function(userId, key, value) {
    return ORM.db.query(
        'INSERT INTO user_data(user_id, `key`, value) VALUES (:userId, :key, :value) ON DUPLICATE KEY UPDATE value = :value, stored_at = CURRENT_TIMESTAMP',
        { replacements: { userId, key, value } }
    );
};
