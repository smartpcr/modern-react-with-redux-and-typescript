"use strict";

let build = require("@microsoft/web-library-build");
let buildConfig = build.getConfig();
let webpackTaskResource = build.webpack.resources;
let webpack = webpackTaskResource.webpack;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin("main.css");

const isProduction = process.argv.indexOf("--production") >= 0;
const rootFolder = path.join(__dirname, "/node_modules/");

const webpackConfig = [
    createConfig(isProduction)
];

function createConfig(isProduction) {
    const bundleName = "bundle";
    const minFileNamePart = isProduction ? ".min" : "";
    const config = {
        entry: {
            [bundleName]: "src/index"
        },
        output: {
            filename: `[name]${minFileNamePart}.js`,
            path: path.resolve(__dirname, "dist"),
            publicPath: "/dist/"
        },
        devtool: isProduction ? "" : "source-map",
        devServer: {
            stats: "none"
        },

        module: {
            rules: [
                {
                    test: /\.scss$/,
                    loader: extractCSS.extract({
                        use: ["css-loader", "sass-loader"]
                    })
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    loader: "url-loader",
                    options: { limit: 25000 }
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loaders: ["babel-loader", "awesome-typescript-loader"]
                }
            ]
        },
        plugins: [extractCSS],
        resolve: {
            extensions: [".js", ".json", ".jsx", ".ts", ".tsx", ".md"],
            alias: {
                react: path.join(rootFolder, "react"),
                "react-dom": path.join(rootFolder, "react-dom"),
                tslib: path.join(rootFolder, "tslib"),
                OfficeFabric: path.join(rootFolder, "office-ui-fabric-react/lib-amd")
            }
        }
    };

    if (isProduction) {
        confg.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
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
            })
        );
    }

    return config;
}

module.exports = webpackConfig;
