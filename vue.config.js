const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const productionGzipExtensions = ['js', 'css']
const resolve = dir => path.resolve(__dirname, dir)
module.exports = {
    publicPath: './', // 默认'/'，部署应用包时的基本 URL
    outputDir: 'dist', // 'dist', 生产环境构建文件的目录
    assetsDir: '',  // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: false,
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: false,  // 生产环境的 source map
    // CSS 相关选项
    css: {
        // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
        extract: true,

        // 是否开启 CSS source map？
        sourceMap: false,

        // 为预处理器的 loader 传递自定义选项。比如传递给
        // sass-loader 时，使用 `{ sass: { ... } }`。
        loaderOptions: {},

        // 为所有的 CSS 及其预处理文件开启 CSS Modules。
        // 这个选项不会影响 `*.vue` 文件。
        modules: false
    },

    // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1,
    pwa: {},

    chainWebpack: config => {
        // 修复HMR
        config.resolve.symlinks(true);
        //修复 Lazy loading routes Error
        config.plugin('html').tap(args => {
            args[0].chunksSortMode = 'none';
            return args;
        });

        // 添加别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('layout', resolve('src/layout'))

    },
    configureWebpack: config => {
        const plugins = []
        if (IS_PROD) {
            plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        mangle: false,
                        output: {
                            beautify: true,//压缩注释
                        }
                    },
                    sourceMap: false,
                    parallel: true,  //使用多进程并行运行来提高构建速度
                })
            )
            // gzip 压缩
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                })
            )
        }
        // plugins.push(new MonacoWebpackPlugin({
        //     languages:["javascript","css","html","json"],
        //     features:["coreCommands","find"]
        // }))
        config.plugins = [...config.plugins, ...plugins]
    },
    devServer: {
        open: IS_PROD,
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false
    }
};
