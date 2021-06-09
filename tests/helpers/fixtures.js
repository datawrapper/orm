const { randomInt } = require('crypto');

function createChart(props = {}) {
    const { Chart } = require('../../models');
    const id = String(randomInt(99999));
    return Chart.create({
        id,
        ...props
    });
}

function createPlugin(props = {}) {
    const { Plugin } = require('../../models');
    const id = String(randomInt(99999));
    return Plugin.create({
        id,
        ...props
    });
}

function createProduct({ team, user, ...props } = {}) {
    const { Product } = require('../../models');
    const id = randomInt(2 ** 16);
    const name = String(randomInt(99999));
    return Product.create({
        id,
        name,
        ...props
    });
}

async function createTeam({ product, ...props } = {}) {
    const { Team } = require('../../models');
    const id = String(randomInt(99999));
    const team = await Team.create({
        id,
        ...props
    });
    if (product) {
        const { TeamProduct } = require('../../models');
        await TeamProduct.create({
            organization_id: team.id,
            productId: product.id
        });
    }
    return team;
}

function createTheme({ data = {}, assets = {}, ...props } = {}) {
    const { Theme } = require('../../models');
    const id = String(randomInt(99999));
    return Theme.create({
        id,
        data,
        assets,
        ...props
    });
}

async function createUser({ teams, product, ...props } = {}) {
    const { User } = require('../../models');
    const id = randomInt(2 ** 16);
    const user = await User.create({
        id,
        email: `user-${id}@datawrapper.de`,
        pwd: 'test',
        ...props
    });
    if (teams) {
        for (const team of teams) {
            const { UserTeam } = require('../../models');
            await UserTeam.create({
                user_id: user.id,
                organization_id: team.id,
                team_role: 'owner'
            });
        }
    }
    if (product) {
        const { UserProduct } = require('../../models');
        await UserProduct.create({
            userId: user.id,
            productId: product.id
        });
    }
    return user;
}

function createJob({ chart, user }) {
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

async function destroyUser(user) {
    const { UserProduct } = require('../../models');
    await UserProduct.destroy({ where: { user_id: user.id }, force: true });
    const { UserTeam } = require('../../models');
    await UserTeam.destroy({ where: { user_id: user.id }, force: true });
    await user.destroy({ force: true });
}

async function destroy(...objects) {
    for (const object of objects) {
        if (!object) {
            continue;
        }
        if (Array.isArray(object)) {
            await destroy(...object);
        } else if (object._modelOptions.tableName === 'user') {
            await destroyUser(object);
        } else {
            await object.destroy({ force: true });
        }
    }
}

module.exports = {
    createChart,
    createJob,
    createPlugin,
    createProduct,
    createTeam,
    createTheme,
    createUser,
    destroy
};
