/* globals process */

const Sequelize = require('sequelize');
const { findPlugins, createRegisterPlugins } = require('./utils/plugins');

let retries = 0;

const ORM = {
    async init(config) {
        const dbConfig = config.orm && config.orm.db ? config.orm.db : config.db;
        const retryInterval = config.orm.retryInterval ? config.orm.retryInterval * 1000 : 3000;

        let configuredPlugins = {};

        if (config.general && config.general.localPluginRoot && config.plugins) {
            configuredPlugins = await findPlugins(config.general.localPluginRoot, config.plugins);
        }

        /**
         * attempts to initialize the ORM. if it fails and
         * `config.orm.retry`` is true, it will retry connecting after
         * 10 seconds.
         */
        async function connect() {
            const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
                host: dbConfig.host,
                port: dbConfig.port,
                dialect: dbConfig.dialect,
                logging: process.env.DEV ? s => process.stdout.write(s + '\n') : false,
                define: {
                    timestamps: true,
                    updatedAt: false,
                    underscored: true
                }
            });

            try {
                if (!config.orm.skipTableTest) {
                    await sequelize.query('select id from chart limit 1');
                }
                ORM.db = sequelize;
                ORM.db.Op = Sequelize.Op;
                ORM.db.Sequelize = Sequelize;
                ORM.token_salt = config.secure_auth_salt || '';
                ORM.chartIdSalt = config.orm.chartIdSalt;
                ORM.hashPublishing = config.orm.hashPublishing;
                ORM.plugins = configuredPlugins;
                ORM.registerPlugins = createRegisterPlugins(ORM, configuredPlugins);
            } catch (err) {
                if (err.name.substr(0, 9) === 'Sequelize' && config.orm && config.orm.retry) {
                    console.warn(err.message);
                    console.warn(
                        `database is not ready, yet. retrying in ${retryInterval / 1000} seconds...`
                    );
                    if (!config.orm.retryLimit || retries < config.orm.retryLimit) {
                        retries++;
                        await wait(connect, retryInterval);
                    } else {
                        throw err;
                    }
                } else {
                    throw err;
                }
            }

            return ORM;
        }

        return connect();
    },
    db: {
        define() {
            console.error('you need to initialize the database first!');
            process.exit(-1);
        }
    }
};

module.exports = ORM;

function wait(f, ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(f());
            } catch (error) {
                reject(error);
            }
        }, ms);
    });
}
