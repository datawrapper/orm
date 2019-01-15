const Folder = require('../Folder');
const User = require('../User');

Folder.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Folder, { foreignKey: 'user_id' });
