const Team = require('../Team');
const Chart = require('../Chart');

Chart.belongsTo(Team, { foreignKey: 'organization_id' });
Team.hasMany(Chart, { foreignKey: 'organization_id' });
