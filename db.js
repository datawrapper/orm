module.exports = {
	db: {
		define() {
			console.error('you need to initialize the database first!');
			process.exit(-1);
		}
	}
}