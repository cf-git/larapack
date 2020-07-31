const webpack = require("webpack");
const CopyPlugin = require('copy-webpack-plugin');
const {styles, scripts} = require('./webpack/templates');

const ENV = process.env.NODE_ENV;
const path = require('path');

const exportList = [];

const files = [
    // {
    //     from: path.resolve(__dirname, 'resources/iconfonts/font'),
    //     to: path.resolve(__dirname, 'public/fonts')
    // },
];


((output, copy) => {
    let fontStyles = {
        mode: ENV,
        entry: {
            fonts: path.resolve(__dirname, "resources/sass/admin/fonts.scss"),
        },
        output,
        plugins: {
            begin: [
            ],
        }
    };
    if (copy.length > 0) {
        fontStyles.plugins.begin.push(
            new CopyPlugin({
                patterns: copy,
                options: {}
            }),
        )
    }
    exportList.push(styles(fontStyles, 'scss'));
    exportList.push(styles({
        mode: ENV,
        entry: {
            bootstrap: path.resolve(__dirname, "resources/sass/admin/bootstrap/bootstrap.scss"),
        },
        output,
    }, 'scss'));
    exportList.push(styles({
        mode: ENV,
        entry: {
            app: path.resolve(__dirname, "resources/sass/admin/app.scss"),
        },
        output,
        resolve: {
            modules: ['node_modules', 'resources/side-libs']
        },
    }, 'scss'));
})({
    path: path.resolve(__dirname, 'public/admin/styles'),
    publicPath: "/admin/styles/",
}, files);

exportList.push(scripts({
    mode: ENV,
    entry: {
        app: path.resolve(__dirname, "resources/js/admin/app.js")
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'public/admin/scripts'),
        publicPath: "/admin/scripts/",
    },
    resolve: {
        modules: ['node_modules']
    },
    resolveLoader: {
        alias: {
            "vars$": path.join(__dirname, "./webpack/var-loader"),
        }
    },
    externals: {},
}, 'js'));

module.exports = exportList;
