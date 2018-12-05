const SQ = require('sequelize');
const {db} = require('../index');
const {uniq} = require('underscore');

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

/*
 * use user.serialize() whenever user info is about
 * to get shared publicly, via API etc
 */
User.prototype.serialize = function() {
    const d = this.toJSON();
    // delete non-safe properties
    delete d.pwd;
    delete d.deleted;
    delete d.created_at;
    delete d.reset_password_token;
    delete d.activate_token;
    return d;
};

User.prototype.canEditChart = async function(chart) {
    // the user is the author!
    if (this.id === chart.author_id) return true;
    // the user has admin privilegen
    if (this.role === 'admin' || this.role === 'sysadmin') return true;
    // the user is member of a team the chart belongs to
    return await this.hasTeam(chart.organization_id);
};

/*
 * get list of all products a user has access to
 * through UserProduct or TeamProducts
 */
User.prototype.getAllProducts = async function() {
    const products = await this.getProducts();
    const teams = await this.getTeams();
    if (teams.length) {
        for (let team of teams) {
            const team_products = await team.getProducts();
            products.push.apply(products, team_products);
        }
    }
    return uniq(products).sort((a,b) => a.priority - b.priority);
};

/*
 * decides whether or not a user may use functions provided
 * by a certain plugin. intended to be used by the plugins
 *
 * @returns true|false
 */
User.prototype.mayUsePlugin = async function(plugin_id) {
    const Plugin = require('./Plugin');
    const plugin = await Plugin.findByPk(plugin_id);
    if (!plugin.is_private) return true;
    // look through all the products of this user
    const products = await this.getAllProducts();
    for (let product of products) {
        const allow = await product.hasPlugin(plugin_id);
        if (allow) return true;
    }
    return false;
};

/*
 * returns a list of all plugins a user has access to
 */
User.prototype.getPlugins = async function() {
    const Plugin = require('./Plugin');
    const plugins = await Plugin.findAll();
    const has_access = [];
    for (let plugin of plugins) {
        if (plugin.enabled) {
            if (!plugin.is_private) {
                has_access.push(plugin);
            } else {
                // check if we gain access through one of the products
                const products = await this.getAllProducts();
                for (let product of products) {
                    const add = await product.hasPlugin(plugin.id);
                    if (add) {
                        has_access.push(plugin);
                        break;
                    }
                }
            }
        }
    }
    return has_access;
}

module.exports = User;
