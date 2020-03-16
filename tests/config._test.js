require('dotenv').config({
    path: require('path').resolve('../../utils/docker/.datawrapper_env')
});

module.exports = {
    orm: {
        chartIdSalt: 'TEST_SALT',
        db: {
            dialect: 'mysql',
            host: 'localhost',
            port: process.env.DW_DATABASE_HOST_PORT,
            user: process.env.DW_DATABASE_USER,
            password: process.env.DW_DATABASE_PASS,
            database: process.env.DW_DATABASE_NAME
        }
    }
};
