import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import loaders from './loaders';
import resolve from './resolve';
import { definePlugin } from './plugins';

export default {
    cache: true,
    entry: {
        index: [
            `${__dirname}/../src/frontend/js/main.js`,
            `${__dirname}/../src/frontend/css/main.scss`,
        ],
    },
    module: {
        loaders: loaders('frontend'),
    },
    output: {
        filename: '[name].js',
        path: `${__dirname}/../../../build/installer`,
        publicPath: '/',
    },
    plugins: [
        definePlugin(),
        new ExtractTextPlugin('[name].css', {
            allChunks: false,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: `${__dirname}/../src/frontend/index.html`,
            hash: true,
        }),
    ],
    resolve: resolve('frontend'),
    devServer: {
        historyApiFallback: true,
    },
};
