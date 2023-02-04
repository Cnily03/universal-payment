const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const FontSpiderPlugin = require('font-spider-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

const StyleLoader = MiniCssExtractPlugin.loader || 'style-loader';

const MODE = (process.env.NODE_ENV || '').trim() === 'production' ? 'production' : 'development';
const IS_DEV = MODE === 'development';

module.exports = {
    entry: {
        index: path.join(__dirname, './src/scripts/index.ts')
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },

    mode: MODE,
    devtool: IS_DEV ? "source-map" : undefined,
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 5555,
    },

    module: {
        rules: [{ // TypeScript
            test: /\.tsx?$/i,
            use: 'ts-loader',
            exclude: /node_modules/
        }, { // CSS
            test: /\.css$/i,
            use: [StyleLoader, 'css-loader']
        }, { // SCSS
            test: /\.s[ac]ss$/i,
            use: [StyleLoader, 'css-loader', 'sass-loader', ]
        }, { // Image File
            test: /\.(png|jpe?g|svg|gif|webp)$/i,
            type: 'asset',
            generator: {
                filename: 'images/[name][ext][query]'
            },
            parser: {
                dataUrlCondition: {
                    maxSize: 32 * 1024 // 限制大小（单位：字节）
                }
            }
        }, { // Font File
            test: /\.(ttf|eot|woff2?)$/i,
            type: 'asset',
            generator: {
                filename: '[name][ext][query]'
            },
            parser: {
                dataUrlCondition: {
                    maxSize: 32 * 1024 // 限制大小（单位：字节）
                }
            }
        }]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './src/index.html'),
            filename: 'index.html',
            inject: "head",
            scriptLoading: 'blocking'
        }),
        new MiniCssExtractPlugin(), // 单独提取 CSS
        // new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/\.(js)$/i]) // Inline JS
        // new CopyWebpackPlugin({
        //     patterns: [{
        //         from: path.resolve(__dirname, './src/public'),
        //         to: path.resolve(__dirname, './dist/public')
        //     }],
        // })
    ].concat(IS_DEV ? [ // 仅在开发环境

    ] : [ // 仅在生产环境
        new FontSpiderPlugin()
    ]),

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), // 优化 Minify CSS
            new TerserWebpackPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                    ecma: undefined,
                    parse: {},
                    compress: {
                        dead_code: false, // 移除没被引用的代码
                        loops: true, // 当循环的判断条件可以确定时，对其进行优化
                        drop_debugger: false,
                        drop_console: false, // 移除全部 console
                        pure_funcs: IS_DEV ? [] : ['console.log'] // 移除特定函数
                    }
                }
            })
        ],
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
}