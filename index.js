/* globals process */

const Sequelize = require('sequelize');

const ORM = {
    init (config) {
        const dbConfig = config.orm && config.orm.db ? config.orm.db : config.db;
        const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: dbConfig.dialect,
            operatorsAliases: false,
            logging: process.env.DEV ? s => process.stdout.write(s + '\n') : false,
            define: {
                timestamps: true,
                updatedAt: false,
                underscored: true
            }
        });
        ORM.db = sequelize;
        ORM.token_salt = config.secure_auth_salt || '';
    },
    db: {
        define () {
            console.error('you need to initialize the database first!');
            process.exit(-1);
        }
    }
};

module.exports = ORM;
