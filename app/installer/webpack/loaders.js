import ExtractTextPlugin from 'extract-text-webpack-plugin';

const sassOptions = 'includePaths[]=./node_modules/compass-mixins/lib/';

export default function (appName) {
    const prefix = appName ? `${appName}/` : '';

    const loaders = [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // Options to configure babel with
        query: {
            cacheDirectory: true,
            plugins: [
                'transform-runtime',
                'add-module-exports',
            ],
            presets: [
                'es2015',
                'react',
                'stage-0',
            ],
        },
    }, {
        test: /\.json$/,
        loader: 'json-loader',
    }, {
        test: /\.jpe?g$|\.gif$|\.png$/,
        loader: `url-loader?limit=10000&name=/${prefix}[hash].[ext]`,
    }, {
        test: /\.(otf|svg)(\?.+)?$/,
        loader: 'url-loader?limit=8192',
    }, {
        test: /\.eot(\?\S*)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject',
    }, {
        test: /\.woff2(\?\S*)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/font-woff2',
    }, {
        test: /\.woff(\?\S*)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/font-woff',
    }, {
        test: /\.ttf(\?\S*)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/font-ttf',
    }, {
        test: /\.html$/,
        loader: 'html',
    }, {
        loader: ExtractTextPlugin.extract(`css!sass?${sassOptions}`),
        test: /\.s?css$/,
    }];

    return loaders;
}
