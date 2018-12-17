/* globals process */

const Sequelize = require('sequelize');

const ORM = {
    init(config) {
        const sequelize = new Sequelize(
            config.db.database,
            config.db.user,
            config.db.password, {
                host: config.db.host,
                port: config.db.port,
                dialect: config.db.dialect,
                operatorsAliases: false,
                logging: process.env.DEV ? (s) => process.stdout.write(s+'\n') : false,
                define: {
                    timestamps: true,
                    updatedAt: false,
                    underscored: true,
                }
            }
        );
        ORM.db = sequelize;
        ORM.token_salt = config.secure_auth_salt || '';
    },
    db: {
        define() {
            console.error('you need to initialize the database first!');
            process.exit(-1);
        }
    }
}

module.exports = ORM;
