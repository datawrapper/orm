
const models = {};

[
	'AccessToken',
	'Action',
	'AuthToken',
	'Chart',
	'ExportJob',
	'Folder',
	'Plugin',
	'PluginData',
	'Product',
    'Session',
    'Stats',
	'Team',
	'Theme',
	'User',
	'UserData',
	'UserTeam'
].forEach(k => {
	models[k] = require('./'+k);
});

require('./assoc/folder-chart');
require('./assoc/folder-team');
require('./assoc/folder-user');
require('./assoc/team-chart');
require('./assoc/user-chart');
require('./assoc/user-theme');

module.exports = models;
