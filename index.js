/* globals process */

const Sequelize = require('sequelize');

const ORM = {
    init(config) {
        const dbConfig = config.orm && config.orm.db ? config.orm.db : config.db;

        return new Promise((resolve, reject) => {
            connect();
            /**
             * attempts to initialize the ORM. if it fails and
             * `config.orm.retry`` is true, it will retry connecting after
             * 10 seconds.
             */
            function connect() {
                const sequelize = new Sequelize(
                    dbConfig.database,
                    dbConfig.user,
                    dbConfig.password,
                    {
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
                    }
                );

                sequelize
                    .query('select id from chart limit 1')
                    .then(() => {
                        ORM.db = sequelize;
                        ORM.token_salt = config.secure_auth_salt || '';
                        resolve();
                    })
                    .catch(err => {
                        if (
                            err.name.substr(0, 9) === 'Sequelize' &&
                            config.orm &&
                            config.orm.retry
                        ) {
                            console.warn(err.message);
                            console.warn('database is not ready, yet. retrying in 10 seconds...');
                            setTimeout(connect, 3000);
                        } else {
                            reject(err);
                        }
                    });
            }
        });
    },
    db: {
        define() {
            console.error('you need to initialize the database first!');
            process.exit(-1);
        }
    }
};

module.exports = ORM;
