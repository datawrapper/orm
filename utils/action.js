const Action = require('../models/Action');

/**
 * helper for logging a user action to the `action` table
 *
 * @param {object|integer} user - user_id or User instance object
 * @param {string} key - the action key
 * @param {*} details - action details
 */
module.exports.logAction = async function(user, key, details) {
    const action = await Action.create({
        key: key,
        details:
            typeof details !== 'number' && typeof details !== 'string'
                ? JSON.stringify(details)
                : details
    });
    return action.setUser(user);
};
