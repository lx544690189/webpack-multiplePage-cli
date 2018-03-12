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
        path: path.resolve(__dirname, '../dist-dev'),
        filename: path.posix.join('js/[name].[chunkhash].js'),
        chunkFilename: path.posix.join('js/[name].[chunkhash].js'),
        publicPath: '/'
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
        //new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        //new webpack.NoEmitOnErrorsPlugin(),
        //new autoInjectHtmlLoader({ title: 'auto inject title' }),
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
    ]
}

var app = express();

// webpack编译器
var compiler = webpack(devWebpackConfig);

// webpack-dev-server中间件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: devWebpackConfig.output.publicPath
});

app.use(devMiddleware)

// 路由
app.get('/:viewname?', function (req, res, next) {

    var viewname = req.params.viewname
        ? req.params.viewname + '.html'
        : 'index.html';

    var filepath = path.join(compiler.outputPath, viewname);

    // 使用webpack提供的outputFileSystem
    compiler.outputFileSystem.readFile(filepath, function (err, result) {
        if (err) {
            // something error
            return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});

module.exports = app.listen(8080, function (err) {
    if (err) {
        // do something
        return;
    }

    console.log('Listening at http://localhost:' + port + '\n')
})