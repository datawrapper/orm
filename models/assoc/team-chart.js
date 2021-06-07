const Team = require('../Team');
const Chart = require('../Chart');
const ChartPublic = require('../ChartPublic');

Chart.belongsTo(Team, { foreignKey: 'organization_id' });
Team.hasMany(Chart, { foreignKey: 'organization_id' });

ChartPublic.belongsTo(Team, { foreignKey: 'organization_id' });
Team.hasMany(ChartPublic, { foreignKey: 'organization_id' });
