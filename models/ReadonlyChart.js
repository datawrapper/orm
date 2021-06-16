const Chart = require('./Chart');
const Team = require('./Team');
const User = require('./User');
const SQ = require('sequelize');
const chartAttributes = require('./chartAttributes');
const pick = require('lodash/pick');
const { db } = require('../index');

class ReadonlyChart extends Chart {
    get user() {
        return this.dataValues.user;
    }

    static async fromChart(chart) {
        const readonlyChart = ReadonlyChart.build({ id: chart.id });
        readonlyChart.dataValues = { ...chart.dataValues };
        return readonlyChart;
    }

    static async fromPublicChart(chart, publicChart) {
        const readonlyChart = ReadonlyChart.build({ id: chart.id });
        readonlyChart.dataValues = {
            ...chart.dataValues,
            ...pick(publicChart.dataValues, [
                'type',
                'title',
                'metadata',
                'external_data',
                'author_id',
                'organization_id'
            ])
        };
        return readonlyChart;
    }
}

ReadonlyChart.init(chartAttributes, {
    sequelize: db,
    validate: {
        never() {
            throw new Error('ReadonlyChart can never be saved to the database');
        }
    }
});

ReadonlyChart.belongsTo(Chart, { foreignKey: 'forked_from' });
ReadonlyChart.belongsTo(Team, { foreignKey: 'organization_id' });
ReadonlyChart.belongsTo(User, { foreignKey: 'author_id' });

module.exports = ReadonlyChart;
