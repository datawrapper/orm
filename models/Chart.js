const SQ = require('sequelize');
const {db} = require('../index');

const Chart = db.define('chart', {
    id: { type: SQ.STRING(5), primaryKey: true },
    type: SQ.STRING,
    title: SQ.STRING,
    theme: SQ.STRING,

    guest_session: SQ.STRING,

    created_at: SQ.DATE,
    last_modified_at: SQ.DATE,
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
}, {
    timestamps: false,
    tableName: 'chart'
});

const Folder = require('./Folder');
const User = require('./User');
const Team = require('./Team');

Chart.belongsTo(User, {foreignKey: 'author_id'});
Chart.belongsTo(Folder, {foreignKey: 'in_folder'});
Chart.belongsTo(Team, {foreignKey: 'organization_id'});

Chart.belongsTo(Chart, {
    foreignKey: 'forked_from',
});

module.exports = Chart;
