
const models = {};

[
	'Chart',
	'ExportJob',
	'Folder',
	'Team',
	'User'
].forEach(k => {
	models[k] = require('./'+k);
});

module.exports = models;
