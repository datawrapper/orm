const SQ = require('sequelize');
const { db } = require('../index');
const assign = require('assign-deep');

const Theme = db.define(
    'theme',
    {
        id: {
            type: SQ.STRING(128),
            primaryKey: true
        },

        title: SQ.STRING(128),

        data: {
            type: SQ.JSON,
            allowNull: false
        },

        less: SQ.TEXT,

        assets: {
            type: SQ.JSON,
            allowNull: false
        }
    },
    {
        tableName: 'theme'
    }
);

Theme.belongsTo(Theme, { foreignKey: 'extend' });

/*
 * retreive "merged" theme data, which is the theme data
 * with all data of "extended" themes merged into it.
 */
Theme.prototype.getMergedData = async function() {
    let theme = this;
    const data = [theme.data];
    while (theme.get('extend')) {
        theme = await Theme.findByPk(theme.get('extend'));
        data.push(theme.data);
    }
    let merged = {};
    while (data.length) {
        merged = assign(merged, data.pop());
    }
    return merged;
};

/*
 * retreive "merged" theme assets, which is the theme assets
 * with all assets of "extended" themes merged into it.
 */
Theme.prototype.getMergedAssets = async function() {
    let theme = this;
    const assets = [theme.assets];
    while (theme.get('extend')) {
        theme = await Theme.findByPk(theme.get('extend'));
        if (theme.assets) assets.push(theme.assets);
    }
    let merged = {};
    while (assets.length) {
        merged = Object.assign(merged, assets.pop());
    }
    return merged;
};

Theme.prototype.addAssetFile = function(name, url) {
    return this.addAsset('file', name, { url });
};

Theme.prototype.addAssetFont = function(name, method, urls) {
    const data = { method };
    if (method === 'import') data.import = urls.import;
    else data.files = urls;
    return this.addAsset('font', name, data);
};

Theme.prototype.addAsset = function(type, name, data) {
    if (!this.assets) this.assets = {};
    this.assets[name] = {
        type,
        ...data
    };
    return this.save({ fields: ['assets'] });
};

Theme.prototype.getAssetUrl = function(name) {
    return this.assets && this.assets[name] ? this.assets[name].url : null;
};

Theme.prototype.getAssets = async function(type) {
    const assets = await this.getMergedAssets();
    return Object.entries(assets)
        .map(([name, value]) => ({ ...value, name }))
        .filter(d => !type || d.type === type);
};

Theme.prototype.getAssetFiles = function() {
    return this.getAssets('file');
};

Theme.prototype.getAssetFonts = function() {
    return this.getAssets('font');
};

Theme.prototype.removeAsset = async function(name) {
    if (this.assets[name]) {
        delete this.assets[name];
        return this.save({ fields: ['assets'] });
    }
};

module.exports = Theme;
