const User = require('../User');
const Chart = require('../Chart');
const ChartPublic = require('../ChartPublic');

Chart.belongsTo(User, { foreignKey: 'author_id' });
User.hasMany(Chart, { foreignKey: 'author_id' });

ChartPublic.belongsTo(User, { foreignKey: 'author_id' });
User.hasMany(ChartPublic, { foreignKey: 'author_id' });
