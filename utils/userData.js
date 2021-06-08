const ORM = require('../');
const UserData = require('../models/UserData');

/**
 * a quick way to retreive a user setting stored in user_data
 * @param {number} userId
 * @param {string} key
 * @param {string} _default - fallback value to be used if key not set yet
 * @returns the stored value
 */
module.exports.getUserData = async function(userId, key, _default = undefined) {
    const row = await UserData.findOne({
        where: { user_id: userId, key }
    });
    return row ? row.data : _default;
};

/**
 * a quick way to set or update a user setting in user_data
 * @param {number} userId
 * @param {string} key
 * @param {string} value
 */
module.exports.setUserData = async function(userId, key, value) {
    return ORM.db.query(
        'INSERT INTO user_data(user_id, `key`, value, stored_at) VALUES (:userId, :key, :value, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE value = :value, stored_at = CURRENT_TIMESTAMP',
        { replacements: { userId, key, value } }
    );
};

/**
 * a quick way to remove user setting in user_data
 * @param {number} userId
 * @param {string} key
 */
module.exports.unsetUserData = async function(userId, key) {
    if (!key) return;
    return UserData.destroy({
        where: {
            user_id: userId,
            key
        }
    });
};
