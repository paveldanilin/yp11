const Path                  = require('path');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const CopyPlugin            = require('copy-webpack-plugin');
const Dotenv                = require('dotenv-webpack');

module.exports = {
    entry: './src/app.js',

    mode: "development",

    output: {
        path: Path.resolve(__dirname, 'dist'),
        filename: 'ypt09.js',
        library: "ypt09",
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
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]'
                        }
                        /*
                        options: {
                            name: 'images/[hash]-[name].[ext]'
                        }
                        */
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
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
