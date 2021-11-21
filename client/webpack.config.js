// import path from 'path'
// import webpack from 'webpack'
// import Dotenv from 'dotenv-webpack'
// import { VueLoaderPlugin } from 'vue-loader'
// import MiniCssExtractPlugin from 'mini-css-extract-plugin'
// import HtmlWebpackPlugin from 'html-webpack-plugin'
// import { CleanWebpackPlugin } from 'clean-webpack-plugin'
// // import OpenBrowserPlugin from 'open-browser-webpack-plugin'

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//! webpack5 增加 nodejs 垫片, 一次性增加所有的垫片
//! https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
// 即将修复的“浏览器列表”错误的临时解决方法, 解决浏览器刷新问题
// const target = process.env.NODE_ENV === "production" ? "browserslist" : "web"
//! sideEffects: 函数副作用是指单调用函数时, 除了函数值返回之外, 还产生了附加影响, 例如, 修改全局变量, 
//! 严格模式下, 函数式语言必须要求无副作用, wp5 会删除副作用, 
//! 如果要取消这个功能, 在package.json中添加 "sideEffects": false 项, 意思是告诉wp5没有副作用, 
//! 但如果有, wp也会干掉这个函数, 如果要留下的话 []

/**
 * 这是方便ES6写代码时采用TS的提示
 * @type {webpack.Configuration}
 */

const config = {
    mode,
    // target,
    entry: path.join(__dirname, "./src/main.js"), // webpack 打包的入口文件
    output: { filename: "bundule.js", path: path.join(__dirname, 'dist') },
    optimization: {
        // moduleIds: 'deterministic', // 模块命名生成规则, 更短的hash值
        // chunkIds: 'deterministic', // 代码块命名生成规则, 更短的hash值
        usedExports: true, //! 标记使用到的导出, tree-shaking 功能, 生产模式下会干掉没有用到的导出
        moduleIds: 'named', // 模块命名生成规则, 带路径的文件名
        chunkIds: 'named', // 代码块命名生成规则, 带路径的文件名
    },
    cache: {
        // wp5 新增的缓存模块, 用于提高构建速度
        type: 'memory', // 默认 memory, filesystem
        // 缓存路径, 默认 'node_modules/.cache/webpack'
        // cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack')
    },
    module: {
        rules: [ // 
            {
                test: /\.js$/,
                exclude: /node_modules/, //排除 node_modules 文件夹下的文件
                use: {
                    // without additional settings, this will reference .babelrc
                    loader: 'babel-loader',
                    // options: {
                    //     // 需要下载的模块, 把 es6 --> es5 的, 这个预设没有转换 
                    //     // async/await, 去掉反而可以了
                    //     presets: ['@babel/preset-env'] 
                    // } 
                }
            },
            { test: /\.vue$/, use: 'vue-loader' },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader, // 插件需要更新,
                    'css-loader', { loader: 'sass-loader', options: { implementation: require("sass"), sassOptions: { fiber: false } } },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            // 导入 veriable, mixins等
                            resources: [path.join(__dirname, './src/scss/scss/entries/main.scss')]
                        }
                    }
                ]
            },
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' },
            // { test: /.(png|jpg|gif|jpeg)$/, use: 'file-loader' },
            //! 资源模块的使用, 不用再安装 file-loader, url-loader 了
            // { test: /\.(ttf|eot|svg|woff|woff2)$/, type: 'asset/resource'}, //! 注意: 字体文件还是要转的, 😀
            {
                //! 对标file-loader, 打包成一个资源
                test: /.(png|jpg|gif|jpeg)$/,
                type: 'asset/resource', //! 注意: 是 'asset/resource', 代表资源, 不是路径 'assets/resource' assets复数
                parser: { dataUrlCondition: { maxSize: 4 * 1024 } }
            },
            { test: /\.ico$/, type: 'asset/resource' }, //! 对标url-loader, 模块小就打包成base64内嵌字符串
            { test: /\.txt$/, type: 'asset/resource' }, //! 对标 raw-loader
            //配置 webpack 支持 .graphql 文件
            { test: /\.(graphql|gql)$/, exclude: /node_modules/, loader: 'graphql-tag/loader' },
            // json5 加载器, 直接运行json5 导入得到 {}, 用这个加载器打包后运行才是正常的结果
            { test: /\.json5$/, use: ['json5-loader'] }, // json5
        ]
    },
    resolve: {
        alias: {
            // 路径的别名
            // '@': path.resolve('src'),
            // 'scss': path.resolve('src/scss'),
            '@': path.join(__dirname, './src'),
            'scss': path.join(__dirname, './src/scss'),
        },
        // 省略后缀
        extensions: ['.js', '.vue', 'json', '.css', '.scss'],
        //! 除了用 new NodePolyfillPlugin() 插件外, 也可以这样自己加载 polyfill
        fallback: {
            // https://github.com/webpack/webpack/pull/8460/commits/a68426e9255edcce7822480b78416837617ab065
            // 上面这个网址是说明 新版 webpack 去掉的 node 垫片
            //! https://stackoverflow.com/questions/65018431/webpack-5-uncaught-referenceerror-process-is-not-defined
            // "process": "process/browser", //! 这里加这个垫片也没工作
            "path": require.resolve("path-browserify"), //! path 可以在前端 chrome 下工作, 不加垫片也可以
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"), // crypto 依赖这个 stream 垫片
            // "buffer": require.resolve("buffer"),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "vue-base",
            template: path.resolve(__dirname, './public/index.html'),
            favicon: path.resolve(__dirname, "./assets/imgs/Jupiter.ico"),
            inject: true
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin(),
        new webpack.HotModuleReplacementPlugin(), // 使用webpack内置插件HMR
        new webpack.DefinePlugin({
            // vue3.0 rc-3 以后, 推荐显式注明构建模式, 这里是开发时的配置, 生成模式重新配置
            "__VUE_OPTIONS_API__": false,
            "__VUE_PROD_DEVTOOLS__": true,
            // 显式指定 i18n 构建配置
            "__VUE_I18N_FULL_INSTALL__": true,
            "__VUE_I18N_LEGACY_API__": true,
            "__INTLIFY_PROD_DEVTOOLS__": false
        }),
        new Dotenv({
            // https://www.webpackjs.com/plugins/environment-plugin/
            // https://github.com/mrsteele/dotenv-webpack
            path: path.resolve(__dirname, '../.env'),
            safe: false
        }),
        // new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
        new webpack.ProvidePlugin({
            // 这里相当于全局的导入
            $: 'jquery', // ∵ typeahead 要用到 jquery, 所以, 在这里配置一下
            jQuery: 'jquery',
            //! https://stackoverflow.com/questions/65018431/webpack-5-uncaught-referenceerror-process-is-not-defined
            process: 'process/browser', //! process垫片加在这里工作了
        }),
        //! 一次性导入所有 node 的垫片
        // new NodePolyfillPlugin()
    ],
    // 浏览器跨域
    devServer: {
        // host: '0.0.0.0', // https://webpack.docschina.org/configuration/dev-server/#devserverhost
        // port: 9000,
        disableHostCheck: true,
        contentBase: "dist",
        hot: true,
        // https://www.jianshu.com/p/95ce563aa7af 请求转发的文章
        proxy: {
            // 1). 配置了一个代理, 只要是 graphql开头的请求, 就去找服务器 3000端口
            //    捕获这个api标志, 如果api中有这个字符串, 就还是匹配, 例如
            //    api 请求 /api/users, 会被代理到请求 http://www.xxxx.com/api/users
            '/': {
                // 2). 代理 api的地址, 就是需要跨域的api地址, 也就是目的地
                // target: 'https://developer.github.com/v4/explorer/',
                target: "http://localhost:3000/",
                // target: "https://pet-library.moonhighway.com/",
                // secure: false, // 如果是https接口，需要配置这个参数
                // 这个设置一下就可以跨域了, 针对客户端的任何请求, 都进行转发
                changeOrigin: true, // 是否跨域
                // 3). 路径重写, 比如请求的路径试 /api/users
                //     设置 '^/api': '' 后, 会把 /api去掉
                //     直接访问 http://www.xxxx.com/users 
                // pathRewrite: {
                //     '^/api':""
                // }
            }
        }
    },
    // 浏览器报警, 加上错误定位就不报警了
    // devtool: 'cheap-module-eval-source-map',
    devtool: 'source-map',
    //! 开启顶层 await 的支持
    experiments: { topLevelAwait: true },
    performance: {
        // 当产品模式下打包会产生 WARNING in asset size limit: The following 
        // asset(s) exceed the recommended size limit (244 KiB).警告
        // https://stackoverflow.com/questions/51737915/webpack-warning-in-asset-size-limit-the-following-assets-exceed-the-recomme
        // 可以设置修改这个打包文件大小的建议
        maxEntrypointSize: 4096000,
        maxAssetSize: 4096000
    }
}
// export default config
module.exports = config
/*
// webpack4 下的package.json 备份
{
    "name": "vue3.0-init",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "build": "webpack -r esm",
        "dev": "webpack-dev-server -r esm",
        "server": "nodemon -r esm .\\..\\server/app.js",
        "test": "concurrently \"npm run server\" \"npm run dev\""
    }
}
*/