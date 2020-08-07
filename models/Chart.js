const crypto = require('crypto');
const SQ = require('sequelize');
const { db, chartIdSalt } = require('../index');
const Team = require('../models/Team');

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

Chart.prototype.getPublicId = async function() {
    let useHash = false;

    if (this.id && this.createdAt && chartIdSalt) {
        useHash = true;
    } else if (this.organization_id) {
        const team = await Team.findByPk(this.organization_id);
        useHash =
            team.settings &&
            team.settings.publishTarget &&
            team.settings.publishTarget.hash_publishing;
    }

    if (!useHash) {
        return this.id;
    }

    const hash = crypto.createHash('md5');
    hash.update(`${this.id}--${this.createdAt.toISOString()}--${chartIdSalt}`);
    return hash.digest('hex');
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

module.exports = Chart;
