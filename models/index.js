
module.exports = (db) => {
	Chart: require('./Chart')(db),
	ExportJob: require('./ExportJob')(db),
}
