const webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const path = require('path')
const autoInjectHtmlLoader = require("./autoInject-html-loader.js")
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const express = require('express')

const devWebpackConfig ={
    entry: {
        page1: path.resolve(__dirname, '../src/view/page1/index.js'),
        page2: path.resolve(__dirname, '../src/view/page2/index.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: path.posix.join('js/[name].js'),
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.(html|tpl)$/,
            use: 'html-loader'
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"]
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            use: 'file-loader'
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
            use: 'file-loader'
        }
        ]
    },
    devtool: 'eval-source-map',
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        compress: true,
        host: 'localhost',
        port: 8080,
        open: false,
        contentBase: path.resolve(__dirname, '../dist'),
        overlay: {
            warnings: false,
            errors: true,
        },
        publicPath: '/',
        //proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: false,
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),//
        new autoInjectHtmlLoader({ title: 'auto inject title' }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src/view/page1/index.html"),
            filename: 'page1.html',
            chunks: ['vendors', 'page1'],
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src/view/page2/index.html"),
            filename: 'page2.html',
            chunks: ['vendors', 'page2'],
            inject: 'body'
        })
    ]
}

//module.exports = devWebpackConfig

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = 8080
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://localhost:8080/`],
                }
            }))

            resolve(devWebpackConfig)
        }
    })
})