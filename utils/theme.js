const Theme = require('../models/Theme');
const assign = require('assign-deep');
const merge = require('merge-deep');
const { indexBy } = require('underscore');

/**
 * in some scenarios it might not be efficient to query themes
 * with all their parent data individually as some themes would
 * get queried multiple times.
 * this implementation provides a single-query alternative by
 * loading all themes first and then using them to resolve the
 * theme data dependencies.
 */
module.exports.getAllMergedThemes = async function() {
    const themes = await Theme.findAll();
    const themesById = indexBy(themes, 'id');
    const out = [];
    for (let i = 0; i < themes.length; i++) {
        let theme = themes[i];
        const data = [];
        const assets = [];
        const less = [];
        do {
            data.push(merge({}, theme.data));
            if (theme.assets) assets.push(theme.assets);
            if (theme.less) less.push(theme.less);
            theme = themesById[theme.extend];
        } while (theme);
        let mergedData = {};
        while (data.length) {
            mergedData = assign(mergedData, data.pop());
        }
        let mergedAssets = {};
        while (assets.length) {
            mergedAssets = Object.assign(mergedAssets, assets.pop());
        }
        theme = themes[i].toJSON();
        theme.data = mergedData;
        theme.assets = mergedAssets;
        theme.less = less.reverse().join('\n\n');
        out.push(theme);
    }

    return out;
};
