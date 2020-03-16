const path = require('path');
module.exports = {
    general: {
        localPluginRoot: path.resolve(path.join(process.cwd(), 'plugins'))
    },
    plugins: {
        'orm-test': {},
        lul: {}
    },
    orm: {
        chartIdSalt: 'TEST_SALT',
        db: {
            dialect: 'mysql',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        }
    }
};
