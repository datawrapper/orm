const SQ = require('sequelize');
const { db } = require('../index');

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

Chart.prototype.isEditableBy = async function(user, session) {
    if (user) {
        return user.mayEditChart(this);
    } else if (session) {
        return this.guest_session && this.guest_session === session.id;
    }
    return false;
};

module.exports = Chart;
