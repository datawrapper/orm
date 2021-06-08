const { randomInt } = require('crypto');

async function createChart(props = {}) {
    const { Chart } = require('../../models');
    const id = String(randomInt(99999));
    return Chart.create({
        id,
        ...props
    });
}

async function createPlugin(props = {}) {
    const { Plugin } = require('../../models');
    const id = String(randomInt(99999));
    return Plugin.create({
        id,
        ...props
    });
}

async function createProduct({ team, user, ...props } = {}) {
    const { Product } = require('../../models');
    const id = randomInt(2 ** 16);
    const name = String(randomInt(99999));
    const product = await Product.create({
        id,
        name,
        ...props
    });
    if (team) {
        const { TeamProduct } = require('../../models');
        await TeamProduct.create({
            teamId: team.id,
            productId: product.id
        });
    }
    if (user) {
        const { UserProduct } = require('../../models');
        await UserProduct.create({
            userId: user.id,
            productId: product.id
        });
    }
    return product;
}

async function createTeam(props = {}) {
    const { Team } = require('../../models');
    const id = String(randomInt(99999));
    return Team.create({
        id,
        ...props
    });
}

async function createTheme({ data = {}, assets = {}, ...props } = {}) {
    const { Theme } = require('../../models');
    const id = String(randomInt(99999));
    return Theme.create({
        id,
        data,
        assets,
        ...props
    });
}

async function createUser({ team, ...props } = {}) {
    const { User } = require('../../models');
    const id = randomInt(2 ** 16);
    const user = await User.create({
        id,
        email: `user-${id}@datawrapper.de`,
        pwd: 'test',
        ...props
    });
    if (team) {
        const { UserTeam } = require('../../models');
        await UserTeam.create({
            user_id: user.id,
            organization_id: team.id
        });
    }
    return user;
}

async function createJob({ chart, user }) {
    const { ExportJob } = require('../../models');
    return ExportJob.create({
        chart_id: chart.id,
        user_id: user.id,
        key: 'test-task',
        created_at: new Date(),
        status: 'queued',
        priority: 0,
        tasks: [{ action: 'sleep', params: { delay: 500 } }]
    });
}

module.exports = {
    createChart,
    createJob,
    createPlugin,
    createProduct,
    createTeam,
    createTheme,
    createUser
};
