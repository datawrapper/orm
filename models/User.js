const SQ = require('sequelize');
const { db } = require('../index');
const { uniq } = require('underscore');

const User = db.define(
    'user',
    {
        id: {
            type: SQ.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        email: { type: SQ.STRING, allowNull: false },
        pwd: { type: SQ.STRING, allowNull: false },

        activate_token: SQ.STRING,
        reset_password_token: SQ.STRING,

        role: {
            type: SQ.ENUM('admin', 'editor', 'pending', 'guest', 'sysadmin', 'graphic-editor'),
            allowNull: false,
            defaultValue: 'pending',
            get() {
                const role = this.getDataValue('role');
                return this.rawAttributes.role.values[role];
            },
            set(val) {
                if (typeof val === 'string') {
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
    },
    {
        tableName: 'user'
    }
);

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
    delete d.customer_id;
    return d;
};

/*
 * check if the user is a Datawrapper admin
 */
User.prototype.isAdmin = function() {
    return this.role === 'admin' || this.role === 'sysadmin';
};

/*
 * check if the user is allowed to view and edit a chart
 */
User.prototype.mayEditChart = async function(chart) {
    // the user is the author!
    if (this.id === chart.author_id) return true;
    // the user has admin privilegen
    if (this.role === 'admin' || this.role === 'sysadmin') return true;
    // the user is member of a team the chart belongs to
    return this.hasTeam(chart.organization_id);
};

/*
 * check if the user is allowed to administrate a team
 */
User.prototype.mayAdministrateTeam = async function(teamId) {
    const UserTeam = require('./UserTeam');
    if (this.role === 'admin' || this.role === 'sysadmin') return true;

    const team = await UserTeam.findOne({
        where: {
            user_id: this.id,
            organization_id: teamId
        }
    });

    if (!team) return false;
    if (team.dataValues.team_role === 2) return false;

    return true;
};

/*
 * get list of all products a user has access to
 * through UserProduct or TeamProducts
 */
User.prototype.getAllProducts = async function() {
    const products = await this.getProducts();
    const teams = await this.getTeams();
    if (teams.length) {
        for (const team of teams) {
            const TeamProducts = await team.getProducts();
            products.push.apply(products, TeamProducts);
        }
    }
    return uniq(products).sort((a, b) => a.priority - b.priority);
};

/*
 * decides whether or not a user may use functions provided
 * by a certain plugin. intended to be used by the plugins
 *
 * @returns true|false
 */
User.prototype.mayUsePlugin = async function(pluginId) {
    const Plugin = require('./Plugin');
    const plugin = await Plugin.findByPk(pluginId);
    if (!plugin.is_private) return true;
    // look through all the products of this user
    const products = await this.getAllProducts();
    for (const product of products) {
        const allow = await product.hasPlugin(pluginId);
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
    const hasAccess = [];
    for (const plugin of plugins) {
        if (plugin.enabled) {
            if (!plugin.is_private) {
                hasAccess.push(plugin);
            } else {
                // check if we gain access through one of the products
                const products = await this.getAllProducts();
                for (const product of products) {
                    const add = await product.hasPlugin(plugin.id);
                    if (add) {
                        hasAccess.push(plugin);
                        break;
                    }
                }
            }
        }
    }
    return hasAccess;
};

module.exports = User;
