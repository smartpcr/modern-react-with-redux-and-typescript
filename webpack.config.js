"use strict";

let build = require("@microsoft/web-library-build");
let buildConfig = build.getConfig();
let webpackTaskResource = build.webpack.resources;
let webpack = webpackTaskResource.webpack;
// var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var extractCSS = new ExtractTextPlugin("main.css");
const path = require("path");
const enlistment = path.join(__dirname, "/node_modules/");
const replace = new webpack.NormalModuleReplacementPlugin(/VSS\/LoaderPlugins.*/, function (resource) {
    resource.request = "vssui-css";
});

const IS_PRODUCTION = process.argv.indexOf("--production") >= 0;
const BUNDLE_NAME = "bundle";

let configs = [
    createConfig(IS_PRODUCTION)
];

function createConfig(isProduction) {
    let minFileNamePart = isProduction ? ".min" : "";
    let webpackConfig = {
        context: path.join(__dirname, buildConfig.libFolder),

        entry: {
            [BUNDLE_NAME]: "./index.js"
        },

        output: {
            path: path.join(__dirname, buildConfig.distFolder),
            publicPath: "/dist/",
            filename: `[name]${minFileNamePart}.js`,
        },

        devtool: isProduction ? "" : "source-map",

        devServer: {
            stats: "none"
        },

        resolve: {
            extensions: [
                ".js",
                ".json",
                ".jsx",
                ".ts",
                ".tsx",
                ".md"
            ],
            alias: {
                'react': path.join(enlistment, 'react'),
                'react-dom': path.join(enlistment, 'react-dom'),
                'tslib': path.join(enlistment, 'tslib'),
                'OfficeFabric': path.join(enlistment, 'office-ui-fabric-react/lib-amd')
            }
        },
        plugins: [
            replace
        ],
        module: {
            rules: [
                {
                    test: /\.css?/,
                    loader: 'style-loader'
                },
                {
                    test: /\.css?/,
                    loader: 'css-loader'
                },
                // {
                //     test: /\.scss$/,
                //     loader: extractCSS.extract({
                //         use: ["css-loader", "sass-loader"]
                //     })
                // },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loaders: ['babel-loader', 'awesome-typescript-loader'],
                },
                // {
                //     test: /\.tsx?$/,
                //     include: /src/,
                //     loader: "ts-loader",
                //     options: { silent: true, transpileOnly: true }
                // },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {}
                        }
                    ]
                }
            ]
        }
    };

    if (isProduction) {
        webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            }
        }));
    }

    return webpackConfig;
}

module.exports = configs;
