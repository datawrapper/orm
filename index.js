const Sequelize = require('sequelize');
const _ = require('./db');

module.exports = {
    init(config) {
        const sequelize = new Sequelize(
            config.database,
            config.user,
            config.password, {
                host: config.host,
                port: config.port,
                dialect: config.dialect,
                operatorsAliases: false
            },
        );
        _.db = sequelize;
    }
}