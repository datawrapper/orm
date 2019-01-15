const Folder = require('../Folder');
const Chart = require('../Chart');

Chart.belongsTo(Folder, { foreignKey: 'in_folder' });
Folder.hasMany(Chart, { foreignKey: 'in_folder' });
