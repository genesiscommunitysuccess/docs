module.exports = function (context, options) {
    const { siteConfig } = context;
    const { themeConfig } = siteConfig;

    if (!themeConfig.webpackOptions) {
        throw new Error('You need to specify `webpackOptions` object in `themeConfig`')
    }

    if (!themeConfig.webpackOptions.options) {
        throw new Error('You specified the `webpackOptions` object in `themeConfig`, but the `options` field is missing.')
    }

    // If the return value is a JavaScript object, it will be merged into the final config using webpack-merge
    // https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis#configureWebpack
    const opts = themeConfig.webpackOptions.options;
    console.info('webpack-options plugin enabled -> using custom webpack options:');
    console.info(opts);

    return {
        name: 'webpack-options',
        // FIXME: why does this run twice? If the console.info statements go in here I see them twice when the docusaurus build starts.
        configureWebpack(config, isServer, utils) {
            return opts;
        },
    };
};