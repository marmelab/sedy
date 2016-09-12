import path from 'path';
import config from 'config';
import webpack from 'webpack';

export default {
    target: 'node',
    entry: ['babel-polyfill', path.join(__dirname, 'src/index.js')],
    output: {
        path: '../../build/lambda',
        publicPath: '/',
        filename: 'index.js',
        libraryTarget: 'commonjs', // Ensure we have exports.handler
    },
    plugins: [
        new webpack.DefinePlugin({ config: JSON.stringify(config) }),
    ],
    module: {
        // Fix a weird webpack bug
        // https://github.com/request/request/issues/1920
        // @TODO Remove octonode for request
        noParse: /node_modules\/octonode\/node_modules\/request\/node_modules\/http-signature\/node_modules\/jsprim\/node_modules\/json-schema\/lib\/validate\.js/,
        loaders: [{
            test: /\.js$/,
            exclude: path.resolve(__dirname, 'node_modules'),
            loader: 'babel',
        }, {
            test: /\.json$/,
            loader: 'json-loader',
        }],
    },
};
