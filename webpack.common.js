const Path                  = require('path');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const CopyPlugin            = require('copy-webpack-plugin');
const Dotenv                = require('dotenv-webpack');

module.exports = {
    entry: './src/app.js',

    output: {
        path: Path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        libraryTarget: "umd",
        umdNamedDefine: true,
        globalObject: "this"
    },

    plugins: [
        new Dotenv(),
        new CopyPlugin([
            { from: './src/templates', to: 'templates' },
        ]),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            hash: true,
            inject: false
        }),
    ],


    module: {
        rules: [
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './fonts',
                        },
                    },
                ]
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]'
                        }
                    }
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            /*
                            publicPath: (resourcePath, context) => {
                                // publicPath is the relative path of the resource to the context
                                // e.g. for ./css/admin/main.css the publicPath will be ../../
                                // while for ./css/main.css the publicPath will be ../
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },*/
                        },
                    },
                    'css-loader',
                ],
            },
        ]
    }
};
