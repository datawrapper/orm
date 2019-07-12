const Action = require('../models/Action');

/**
 * helper for logging a user action to the `action` table
 *
 * @param {object} user
 * @param {string} key
 * @param {*} details
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
