import config from 'config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { DefinePlugin, optimize } from 'webpack';

const env = process.env.NODE_ENV;

const gaScript = config.ga ? `<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', '${config.ga}', 'marmelab.com')
    ga('send', 'pageview')
</script>` : '<!-- no analytics -->';

const htmlConstants = {
    title: 'Sedy - fix typos for you',
    description: 'A github webhook based bot to fix typos in pull requests, by @marmelab.',
    url: 'https://marmelab.com/sedy',
    image: 'https://avatars2.githubusercontent.com/u/3116319', // Marmelab GitHub avatar
    ga: gaScript,
};

export default {
    entry: {
        style: './style.css',
        home: './js/home',
        setup: './js/setup',
    },
    output: {
        path: 'build/',
        filename: '[name].js',
    },
    module: {
        loaders: [
            { test: /\.css$/, include: `${__dirname}/style.css`, loader: ExtractTextPlugin.extract('css') },
            { test: /\.js$/, include: `${__dirname}/js`, loader: 'babel' },
            {
                test: /\.(svg|png)$/,
                include: [
                    `${__dirname}/icons`,
                    `${__dirname}/images`,
                ],
                loader: 'file-loader',
            },
        ],
    },
    plugins: [
        new DefinePlugin({
            APP_BASE_URL: JSON.stringify(config.appBaseUrl),
            GITHUB_APP_ID: JSON.stringify(config.githubAppId),
            GITHUB_REDIRECTION: JSON.stringify(config.githubRedirection),
            GITHUB_SCOPES: JSON.stringify(config.githubScopes),
            GITHUB_URL: JSON.stringify(config.githubUrl),
            WEBHOOK_URL: JSON.stringify(config.webhookUrl),
            SEDY_USERNAME: JSON.stringify(config.sedyUsername),
            'process.env': {
                NODE_ENV: JSON.stringify(env),
            },
        }),
        new HtmlWebpackPlugin({
            ...htmlConstants,
            template: './index.html',
            filename: 'index.html',
            chunks: ['style', 'home'],
            hash: true,
        }),
        new HtmlWebpackPlugin({
            ...htmlConstants,
            template: './setup.html',
            filename: 'setup/index.html',
            chunks: ['style', 'setup'],
            hash: true,
        }),
        new ExtractTextPlugin('style.css'),
    ].concat(env === 'production' ? [new optimize.UglifyJsPlugin()] : []),
};
