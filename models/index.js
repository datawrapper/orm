
const models = {};

[
	'AccessToken',
	'Action',
	'Chart',
	'ExportJob',
	'Folder',
	'Plugin',
	'PluginData',
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
require('./assoc/user-chart');
require('./assoc/user-theme');

module.exports = models;
