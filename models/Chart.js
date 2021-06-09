const crypto = require('crypto');
const SQ = require('sequelize');
const { db, chartIdSalt, hashPublishing } = require('../index');
const Team = require('../models/Team');
const get = require('lodash/get');

const Chart = db.define(
    'chart',
    {
        id: { type: SQ.STRING(5), primaryKey: true },
        type: SQ.STRING,
        title: SQ.STRING,
        theme: SQ.STRING,

        guest_session: SQ.STRING,

        last_edit_step: SQ.INTEGER,

        published_at: SQ.DATE,
        public_url: SQ.STRING,
        public_version: SQ.INTEGER,

        deleted: SQ.BOOLEAN,
        deleted_at: SQ.DATE,

        forkable: SQ.BOOLEAN,
        is_fork: SQ.BOOLEAN,

        metadata: SQ.JSON,
        language: SQ.STRING(5),
        external_data: SQ.STRING(),

        utf8: SQ.BOOLEAN
    },
    {
        updatedAt: 'last_modified_at',
        tableName: 'chart'
    }
);

Chart.belongsTo(Chart, {
    foreignKey: 'forked_from'
});

Chart.prototype.setAttributesFromPublicChart = async function() {
    const { ChartPublic } = require('../models');
    const publicChart = await ChartPublic.findOne({ where: { id: this.id } });
    if (!publicChart) {
        return false;
    }
    for (const attr of [
        'type',
        'title',
        'metadata',
        'external_data',
        'author_id',
        'organization_id'
    ]) {
        this.set(attr, publicChart[attr]);
    }
    return true;
};

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
