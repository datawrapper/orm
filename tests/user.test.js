const test = require('ava');
const {
    createChart,
    createPlugin,
    createProduct,
    createTeam,
    createUser,
    destroy
} = require('./helpers/fixtures');
const { init } = require('./helpers/orm');

test.before(async t => {
    t.context.orm = await init();

    const { Chart, UserPluginCache } = require('../models');
    t.context.Chart = Chart;

    t.context.defaultProduct = await createProduct({
        priority: -50
    });
    t.context.teamProduct = await createProduct();
    t.context.teamProductHighPrio = await createProduct({
        priority: 30
    });
    t.context.userProduct = await createProduct();

    t.context.team1 = await createTeam({
        name: 'Team No. 1',
        product: t.context.teamProduct
    });
    t.context.team2 = await createTeam({
        name: 'Team No. 2',
        product: t.context.teamProductHighPrio
    });

    t.context.adminUser = await createUser({
        role: 'admin',
        pwd: 'test',
        activate_token: 'my-activate-token',
        reset_password_token: 'my-reset-passwod-token',
        customer_id: 'my-customer-id'
    });

    t.context.teamUser = await createUser({
        role: 'editor',
        teams: [t.context.team1]
    });
    t.context.teamUserChart = await createChart({
        author_id: t.context.teamUser.id
    });

    t.context.productUser = await createUser({
        role: 'editor',
        teams: [t.context.team1],
        product: t.context.userProduct
    });
    t.context.productUserCharts = await Promise.all(
        Array(2)
            .fill()
            .map(() => createChart({ author_id: t.context.productUser.id }))
    );

    t.context.pendingUser = await createUser({
        activate_token: '12345678',
        teams: [t.context.team1, t.context.team2]
    });

    t.context.publicPlugin = await createPlugin({
        enabled: true,
        is_private: false
    });
    t.context.disabledPlugin = await createPlugin({
        enabled: false,
        is_private: false
    });
    t.context.privatePlugin = await createPlugin({
        enabled: true,
        is_private: true
    });
    t.context.privatePluginCached = await createPlugin({
        enabled: true,
        is_private: true
    });
    t.context.userPluginCache = await UserPluginCache.create({
        user_id: t.context.adminUser.id,
        plugins: [t.context.publicPlugin.id, t.context.privatePluginCached.id].join(',')
    });
});

test.after.always(async t => {
    await destroy(
        t.context.userPluginCache,
        t.context.privatePluginCached,
        t.context.privatePlugin,
        t.context.disabledPlugin,
        t.context.publicPlugin,
        t.context.productUserCharts,
        t.context.productUser,
        t.context.pendingUser,
        t.context.teamUserChart,
        t.context.teamUser,
        t.context.adminUser,
        t.context.team2,
        t.context.team1,
        t.context.userProduct,
        t.context.teamProductHightPrio,
        t.context.teamProduct,
        t.context.defaultProduct
    );
    await t.context.orm.db.close();
});

test('admin user has role admin', t => {
    const { adminUser } = t.context;
    t.is(adminUser.role, 'admin');
    t.is(adminUser.get('role'), 'admin');
});

test('user.serialize returns object', t => {
    const { adminUser } = t.context;
    const obj = adminUser.serialize();
    t.is(typeof obj, 'object');
});

test('serialized user excludes sensitive data', t => {
    const { adminUser } = t.context;
    const obj = adminUser.serialize();
    t.is(obj.pwd, undefined);
    t.is(obj.activate_token, undefined);
    t.is(obj.reset_password_token, undefined);
    t.is(obj.customer_id, undefined);
    t.is(obj.created_at, undefined);
});

test('admin user has not charts', async t => {
    const { Chart, adminUser } = t.context;
    t.is(typeof adminUser.getCharts, 'function', 'user.getCharts() is undefined');
    const result = await adminUser.getCharts();
    t.deepEqual(result, []);
    const chartCount = await Chart.count({ where: { author_id: adminUser.id } });
    t.is(chartCount, 0);
});

test('admin user has no teams', async t => {
    const { adminUser } = t.context;
    t.is(typeof adminUser.getTeams, 'function', 'user.getTeams() is undefined');
    const result = await adminUser.getTeams();
    t.deepEqual(result, []);
});

test('admin user has no folders', async t => {
    const { adminUser } = t.context;
    t.is(typeof adminUser.getFolders, 'function', 'user.getFolders() is undefined');
    const result = await adminUser.getFolders();
    t.deepEqual(result, []);
});

test('admin user has no themes', async t => {
    const { adminUser } = t.context;
    t.is(typeof adminUser.getThemes, 'function', 'user.getThemes() is undefined');
    const result = await adminUser.getThemes();
    t.deepEqual(result, []);
});

test('admin user has no user data', async t => {
    const { adminUser } = t.context;
    t.is(typeof adminUser.getUserData, 'function', 'user.getUserData() is undefined');
    const result = await adminUser.getUserData();
    t.deepEqual(result, []);
});

test('admin user has no user or team product', async t => {
    const { adminUser } = t.context;
    t.is(typeof adminUser.getProducts, 'function', 'user.getProducts() is undefined');
    const result = await adminUser.getProducts();
    t.deepEqual(result, []);
});

test('user has public plugin in userPluginCache', async t => {
    const { adminUser, publicPlugin } = t.context;
    const res = await adminUser.getUserPluginCache();
    const plugins = res.plugins.split(',');
    t.true(plugins.includes(publicPlugin.id));
});

test('user may use public plugin', async t => {
    const { adminUser, publicPlugin } = t.context;
    t.true(await adminUser.mayUsePlugin(publicPlugin.id));
});

test('user may not use private plugin that is not in userPluginCache', async t => {
    const { adminUser, privatePlugin } = t.context;
    t.false(await adminUser.mayUsePlugin(privatePlugin.id));
});

test('user may use private plugin that is in userPluginCache', async t => {
    const { adminUser, privatePluginCached } = t.context;
    t.true(await adminUser.mayUsePlugin(privatePluginCached.id));
});

test('user may not use non-existent plugin', async t => {
    const { adminUser } = t.context;
    t.false(await adminUser.mayUsePlugin('foo'));
});

test('user may not use disabled plugin', async t => {
    const { adminUser, disabledPlugin } = t.context;
    t.false(await adminUser.mayUsePlugin(disabledPlugin.id));
});

test('team user has role editor', t => {
    const { teamUser } = t.context;
    t.is(teamUser.role, 'editor');
});

test('team user has one chart', async t => {
    const { Chart, teamUser, teamUserChart } = t.context;
    const result = await teamUser.getCharts();
    t.is(result.length, 1);
    t.is(result[0].id, teamUserChart.id);
    const chartCount = await Chart.count({ where: { author_id: teamUser.id } });
    t.is(chartCount, 1);
});

test('team user has one team', async t => {
    const { teamUser } = t.context;
    const result = await teamUser.getTeams();
    t.is(result.length, 1);
    t.is(result[0].name, 'Team No. 1');
    t.is(result[0].user_team.getDataValue('team_role'), 0); // owner
});

test('product user has two charts', async t => {
    const { Chart, productUser } = t.context;
    const result = await productUser.getCharts();
    t.is(result.length, 2);
    const chartCount = await Chart.count({ where: { author_id: productUser.id } });
    t.is(chartCount, 2);
});

test('pending user has role pending', t => {
    const { pendingUser } = t.context;
    t.is(pendingUser.role, 'pending');
    t.is(pendingUser.get('role'), 'pending');
});

test('pending user has activation token', t => {
    const { pendingUser } = t.context;
    const obj = pendingUser.serialize();
    t.is(pendingUser.activate_token, '12345678');
});

test('pending user has is not activated', t => {
    const { pendingUser } = t.context;
    const obj = pendingUser.serialize();
    t.is(pendingUser.isActivated(), false);
});

test('user.getActiveProduct returns default product', async t => {
    const { defaultProduct, adminUser } = t.context;
    const activeProduct = await adminUser.getActiveProduct();
    // Check priority instead of id, because it can happen that an external testing database is
    // dirty and contains several products with low priority, in which case the default product will
    // be chosen randomly and might not be out 'defaultProduct'.
    t.is(activeProduct.priority, defaultProduct.priority);
});

test('user.getActiveProduct returns team product', async t => {
    const { teamProduct, teamUser } = t.context;
    const activeProduct = await teamUser.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, teamProduct.id);
});

test('user.getActiveProduct returns prefers user product to team product', async t => {
    const { userProduct, productUser } = t.context;
    const activeProduct = await productUser.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, userProduct.id);
});

test('user.getActive product returns team product with higher priority', async t => {
    const { teamProductHighPrio, pendingUser } = t.context;
    const activeProduct = await pendingUser.getActiveProduct();
    t.truthy(activeProduct);
    t.is(activeProduct.id, teamProductHighPrio.id);
});
