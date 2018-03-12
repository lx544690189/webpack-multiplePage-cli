const webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const path = require('path')
const autoInjectHtmlLoader = require("./autoInject-html-loader.js")

module.exports = {
    entry: {
        page1: path.resolve(__dirname, '../src/view/page1/index.js'),
        page2: path.resolve(__dirname, '../src/view/page2/index.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: path.posix.join('js/[name].[chunkhash].js'),
        chunkFilename: path.posix.join('js/[name].[chunkhash].js'),
        publicPath: './'
    },
    module: {
        rules: [{
                test: /\.(html|tpl)$/,
                use: 'html-loader'
            }, {
                test: /\.css$/,
                //use: ["style-loader", "css-loader", "postcss-loader"]
                //使用ExtractTextPlugin抽离css，不编译到js中
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader?importLoaders=1', 'postcss-loader']
                })
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
    plugins: [
        //使用html-loader时ejs语法不能使用，这里自定义一个html预处理器，来完成公共代码的插入
        new autoInjectHtmlLoader({ title: 'auto inject title' }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src/view/page1/index.html"),
            filename: 'page1.html',
            chunks: ['vendors', 'page1'],
            inject: 'body',
            title: 'from HtmlWebpackPlugin inject'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src/view/page2/index.html"),
            filename: 'page2.html',
            chunks: ['vendors', 'page2'],
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new ExtractTextPlugin({
            filename: path.posix.join('css/[name].[chunkhash].css'),
        })
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true, //是否生成sourceMap
        //     compress: {
        //         warnings: false
        //     }
        // }),
        // new webpack.LoaderOptionsPlugin({
        //     minimize: true //是否压缩代码
        // })
    ]
}