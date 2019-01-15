const User = require('../User');
const Chart = require('../Chart');

Chart.belongsTo(User, { foreignKey: 'author_id' });
User.hasMany(Chart, { foreignKey: 'author_id' });
