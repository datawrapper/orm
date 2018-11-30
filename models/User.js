const SQ = require('sequelize');
const {db} = require('../index');

const User = db.define('user', {

    id: {
        type:SQ.INTEGER,
        primaryKey:true,
        autoIncrement: true,
    },

    email: { type: SQ.STRING, allowNull: false },
    pwd: { type: SQ.STRING, allowNull: false },

    activate_token: SQ.STRING,
    reset_password_token: SQ.STRING,

    role: {
        type: SQ.ENUM('admin', 'editor', 'pending',
            'guest', 'sysadmin', 'graphic-editor'),
        allowNull: false,
        defaultValue: 'pending',
        get() {
            const role = this.getDataValue('role');
            return this.rawAttributes.role.values[role];
        },
        set(val) {
            if (typeof val == 'string') {
                val = this.rawAttributes.role.values.indexOf(val);
                if (val > -1) this.setDataValue('role', val);
            }
        }
    },

    deleted: SQ.BOOLEAN,
    language: { type: SQ.STRING(5), defaultValue: 'en-US' },
    created_at: SQ.DATE,

    // extended user profiles
    name: SQ.STRING,
    website: SQ.STRING,
    sm_profile: SQ.STRING, // social media
    oauth_signin: SQ.STRING,
    customer_id: SQ.STRING
}, {
    tableName: 'user'
});

module.exports = User;
