const CSSWithoutJSMap = require('./css-without-js-map');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require("webpack");

const compile = (config, options) => {
    const result = {};

    Object.assign(result, config);

    result.resolve = options.resolve || {};
    result.externals = options.externals || {};
    result.resolveLoader = options.resolveLoader || {};

    if (!options.plugins) return result;

    if (options.plugins.begin) {
        (Array.isArray(options.plugins.begin) &&
            Array.prototype.unshift.apply(result.plugins, options.plugins.begin)
        ) ||
        result.plugins.unshift(options.plugins.begin);
    }
    if (options.plugins.end) {
        (Array.isArray(options.plugins.end) &&
            Array.prototype.push.apply(result.plugins, options.plugins.end)
        ) ||
        result.plugins.push(options.plugins.end);
    }
    return result;
};

const availableStyleRules = {
    scss: [
        {
            test: /\.s[ac]ss$/i,
            exclude: /(node_modules)/,
            use: [
                // fallback to style-loader in development
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader', options: {
                        modules: {localIdentName: '[local]'},
                        sourceMap: true,
                        url: false
                    }
                },
                {
                    loader: 'postcss-loader', options: {
                        sourceMap: true,
                        url: false,
                        modules: true,
                        importLoaders: 1,
                        plugins: [
                            require('autoprefixer')
                        ]
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        implementation: require('sass'),
                        webpackImporter: true
                    }
                }
            ],
        }
    ],
    less: [
        {
            test: /\.less$/i,
            exclude: /(node_modules)/,
            use: [
                // fallback to style-loader in development
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader', options: {
                        modules: {localIdentName: '[local]'},
                        sourceMap: true,
                        // url: false
                    }
                },
                {
                    loader: 'postcss-loader', options: {
                        sourceMap: true,
                        // url: false,
                        modules: true,
                        importLoaders: 1,
                        plugins: [
                            require('autoprefixer')
                        ]
                    }
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                        implementation: require('less'),
                        webpackImporter: false,
                        // url: false,
                    }
                }
            ],
        }
    ],
};

const styles = (options, styleTypes) => {
    const ENV = options.mode || options.ENV || "production";
    let rules = options.rules || [];
    let styleType;
    if (!rules.length && styleTypes) {
        styleTypes = styleTypes.split(',');
        while ((styleType = styleTypes.shift())) {
            if (!availableStyleRules[styleType]) {
                new Error(`Undefined style type: ${styleType}. Please define your style rule in this list`);
            }
            rules = rules.concat(availableStyleRules[styleType]);
        }
    }
    const config = {
        mode: ENV,
        entry: options.entry || {},
        output: options.output || {},
        module: {
            rules,
        },
        optimization: {
            minimize: ENV === 'production',
            nodeEnv: ENV,
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            new CSSWithoutJSMap([/\.js(\.map)?$/]),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map'
            }),
            new webpack.ProgressPlugin(function (progress, type) {
                if (!progress && type === "compiling") {
                    process.stdout.write('\u001b[2J\u001b[1;1HRun building\n');
                }
            }),
        ],
    };
    return compile(config, options);
};

const availableScriptRules = {
    js: [
        {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader'],
        },
        {
            test: /\.js$/i,
            exclude: /(node_modules)/,
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread'],
                    },
                },
            ],
        },
    ]
};

const scripts = (options, scriptTypes) => {
    const ENV = options.mode || options.ENV || "production";
    let rules = options.rules || [];
    let scriptType;
    if (!rules.length && scriptTypes) {
        scriptTypes = scriptTypes.split(',');
        while ((scriptType = scriptTypes.shift())) {
            if (!availableScriptRules[scriptType]) {
                new Error(`Undefined script type: ${scriptType}. Please define your style rule in this list`);
            }
            rules = rules.concat(availableScriptRules[scriptType]);
        }
    }

    const config = {
        mode: ENV,
        entry: options.entry || {},
        output: options.output || {},
        module: {
            rules,
        },
        optimization: {
            minimize: ENV === 'production',
            nodeEnv: ENV,
        },
        plugins: [
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map'
            }),
            new webpack.ProgressPlugin(function (progress, type) {
                if (!progress && type === "compiling") {
                    process.stdout.write('\u001b[2J\u001b[1;1HRun building\n');
                }
            })
        ],
    };

    return compile(config, options);
};

module.exports = {
    styles,
    scripts,
};
