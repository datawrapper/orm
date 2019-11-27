const Action = require('../models/Action');

/**
 * helper for logging a user action to the `action` table
 *
 * @param {integer} userId - user id
 * @param {string} key - the action key
 * @param {*} details - action details
 */
module.exports.logAction = async function(userId, key, details) {
    return Action.create({
        key: key,
        user_id: userId,
        details:
            typeof details !== 'number' && typeof details !== 'string'
                ? JSON.stringify(details)
                : details
    });
};
