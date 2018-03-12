const webpack = require('webpack')
const path = require('path')
const rm = require('rimraf')
const ora = require('ora')
const chalk = require('chalk')
const webpackConfig = require('./webpack.prod.config')


const spinner = ora('building for production...')
spinner.start()
//清理disk目录
rm(path.resolve(__dirname, '../dist'), err => {
    if (err) throw err
    //webpack打包
    webpack(webpackConfig, function (err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'))
    })
})