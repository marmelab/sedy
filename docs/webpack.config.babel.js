import config from 'config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { DefinePlugin } from 'webpack';

export default {
    entry: {
        style: './style.css',
        home: './js/home',
        setup: './js/setup',
    },
    output: {
        filename: 'build/[name].js',
    },
    module: {
        loaders: [
            { test: /\.css$/, include: `${__dirname}/style.css`, loader: ExtractTextPlugin.extract('css') },
            { test: /\.js$/, include: `${__dirname}/js`, loader: 'babel' },
            { test: /\.svg$/, include: `${__dirname}/icons`, loader: 'file-loader' },
        ],
    },
    plugins: [
        new DefinePlugin({
            APP_BASE_URL: JSON.stringify(config.appBaseUrl),
            GITHUB_APP_ID: JSON.stringify(config.githubAppId),
            GITHUB_REDIRECTION: JSON.stringify(config.githubRedirection),
            GITHUB_SCOPES: JSON.stringify(config.githubScopes),
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            chunks: ['style', 'home'],
        }),
        new HtmlWebpackPlugin({
            template: './setup.html',
            filename: 'setup.html',
            chunks: ['style', 'setup'],
        }),
        new ExtractTextPlugin('style.css'),
    ],
};
