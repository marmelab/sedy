import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    entry: {
        style: './style.css',
        home: './js/home',
    },
    output: {
        filename: 'build/[name].js',
    },
    module: {
        loaders: [
            { test: /\.css$/, include: `${__dirname}/style.css`, loader: ExtractTextPlugin.extract('css') },
            { test: /\.js$/, include: `${__dirname}/js`, loader: 'babel' },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
        }),
        new ExtractTextPlugin('style.css'),
    ],
};
