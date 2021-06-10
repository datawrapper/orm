const SQ = require('sequelize');
const Team = require('./Team');
const chartAttributes = require('./chartAttributes');
const crypto = require('crypto');
const get = require('lodash/get');
const { db, chartIdSalt, hashPublishing } = require('../index');

const Chart = db.define('chart', chartAttributes, {
    updatedAt: 'last_modified_at',
    tableName: 'chart'
});

Chart.belongsTo(Chart, {
    foreignKey: 'forked_from'
});

Chart.prototype.getPublicId = async function() {
    if (this.id && chartIdSalt && this.createdAt) {
        let hash = false;

        if (this.organization_id) {
            const team = await Team.findByPk(this.organization_id);
            hash = !!get(team, 'settings.publishTarget.hash_publishing');
        }

        if (hashPublishing) {
            hash = true;
        }

        if (hash) {
            const hash = crypto.createHash('md5');
            hash.update(`${this.id}--${this.createdAt.toISOString()}--${chartIdSalt}`);
            return hash.digest('hex');
        }
    }

    return this.id;
};

Chart.prototype.isEditableBy = async function(user, session) {
    if (this.deleted) return false;

    if (user && user.role !== 'guest') {
        return user.mayEditChart(this);
    } else if (session) {
        return this.guest_session && this.guest_session === session;
    }
    return false;
};

Chart.prototype.isPublishableBy = async function(user) {
    if (user) {
        // guests and pending users are not allowed to publish
        if (!user.isActivated()) return false;
        return user.mayEditChart(this);
    }
    return false;
};

Chart.prototype.getThumbnailHash = function() {
    if (this.createdAt) {
        return crypto
            .createHash('md5')
            .update(`${this.id}--${this.createdAt.getTime() / 1000}`)
            .digest('hex');
    }
};

module.exports = Chart;
