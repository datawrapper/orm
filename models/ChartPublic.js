const SQ = require('sequelize');
const { db } = require('../index');
const Chart = require('./Chart');

class ChartPublic extends SQ.Model {}

ChartPublic.init(
    {
        id: { type: SQ.STRING(5), primaryKey: true },
        type: SQ.STRING,
        title: SQ.STRING,
        metadata: SQ.JSON,
        external_data: SQ.STRING(),
        first_published_at: SQ.DATE(),
        author_id: SQ.INTEGER(),
        organization_id: SQ.STRING(128)
    },
    {
        sequelize: db,
        tableName: 'chart_public',
        modelName: 'chart_public',
        createdAt: 'first_published_at'
    }
);

ChartPublic.belongsTo(Chart, { foreignKey: 'id' });

module.exports = ChartPublic;
