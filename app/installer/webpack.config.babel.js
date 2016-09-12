import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import loaders from './webpack/loaders';
import resolve from './webpack/resolve';
import { definePlugin } from './webpack/plugins';

export default {
    cache: true,
    entry: {
        index: [
            `${__dirname}/src/js/main.js`,
            `${__dirname}/src/css/main.scss`,
        ],
    },
    module: {
        loaders: loaders(),
    },
    output: {
        filename: '[name].js',
        path: `${__dirname}/../../build/installer`,
        publicPath: '/',
    },
    plugins: [
        definePlugin(),
        new ExtractTextPlugin('[name].css', {
            allChunks: false,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: `${__dirname}/src/index.html`,
            hash: true,
        }),
    ],
    resolve: resolve('frontend'),
    devServer: {
        historyApiFallback: true,
    },
};
