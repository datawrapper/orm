const ORM = require('../../index');
const { requireConfig } = require('@datawrapper/shared/node/findConfig');

const config = requireConfig();

async function init() {
    const orm = await ORM.init(config);
    const { db } = ORM;

    require('../../models');
    await db.sync();

    return orm;
}

module.exports = {
    init
};
