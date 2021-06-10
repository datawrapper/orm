const Chart = require('./Chart');
const Team = require('./Team');
const User = require('./User');
const SQ = require('sequelize');
const chartAttributes = require('./chartAttributes');
const pick = require('lodash/pick');
const { db } = require('../index');

class ReadonlyChart extends Chart {}

ReadonlyChart.init(chartAttributes, {
    sequelize: db,
    validate: {
        never() {
            throw new Error('ReadonlyChart can never be saved to the database');
        }
    }
});

ReadonlyChart.belongsTo(Chart, {
    foreignKey: 'forked_from'
});

ReadonlyChart.belongsTo(Team, { foreignKey: 'organization_id' });

ReadonlyChart.belongsTo(User, { foreignKey: 'author_id' });

ReadonlyChart.fromChart = function(chart) {
    return ReadonlyChart.build(chart.get());
};

ReadonlyChart.fromPublicChart = async function(publicChart) {
    const chart = await publicChart.getChart();
    return ReadonlyChart.build({
        ...chart.get(),
        ...pick(publicChart.get(), [
            'type',
            'title',
            'metadata',
            'external_data',
            'author_id',
            'organization_id'
        ])
    });
};

module.exports = ReadonlyChart;
