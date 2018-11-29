const Plugin = require('../Plugin');
const PluginData = require('../PluginData');

PluginData.belongsTo(Plugin);
Plugin.hasMany(PluginData, {as: 'PluginData'});

// Chart.belongsTo(Folder, {foreignKey: 'in_folder'});
// Folder.hasMany(Chart, {foreignKey: 'in_folder'});
