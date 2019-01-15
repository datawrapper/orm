const Folder = require('../Folder');
const Team = require('../Team');

Folder.belongsTo(Team, { foreignKey: 'org_id' });
Team.hasMany(Folder, { foreignKey: 'org_id' });
