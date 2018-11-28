const Sequelize = require('sequelize');

const ORM = {
    init(config) {
        const sequelize = new Sequelize(
            config.database,
            config.user,
            config.password, {
                host: config.host,
                port: config.port,
                dialect: config.dialect,
                operatorsAliases: false,
                logging: process.env.DEV ? console.log : false,
                define: {
                    timestamps: true,
                    updatedAt: false,
                    underscored: true,
                }
            },
        );
        ORM.db = sequelize;
    },
    db: {
        define() {
            console.error('you need to initialize the database first!');
            process.exit(-1);
        }
    }
}

module.exports = ORM;