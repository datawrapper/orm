
const models = {};

[
	'Chart',
	'ExportJob',
	'Folder',
	'Team',
	'Theme',
	'User',
	'UserTeam'
].forEach(k => {
	models[k] = require('./'+k);
});

require('./assoc/folder-chart');
require('./assoc/folder-team');
require('./assoc/folder-user');
require('./assoc/user-chart');

module.exports = models;
