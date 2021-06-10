const models = {};

[
    'AccessToken',
    'Action',
    'Chart',
    'ChartPublic',
    'ChartAccessToken', // deprecated
    'ExportJob',
    'Folder',
    'Plugin',
    'PluginData',
    'Product',
    'ProductPlugin',
    'Session',
    'Stats',
    'Team',
    'TeamProduct',
    'TeamTheme',
    'Theme',
    'User',
    'UserData',
    'UserPluginCache',
    'UserProduct',
    'UserTeam'
].forEach(k => {
    models[k] = require('./' + k);
});

require('./assoc/folder-chart');
require('./assoc/folder-team');
require('./assoc/folder-user');
require('./assoc/team-chart');
require('./assoc/user-chart');
require('./assoc/user-theme');

module.exports = models;
