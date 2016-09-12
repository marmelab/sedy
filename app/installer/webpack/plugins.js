import config from 'config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

export function definePlugin() {
    return new webpack.DefinePlugin({
        APP_NAME: JSON.stringify(config.appName),
        APP_URL: JSON.stringify(config.apps.frontend.url),
        FRONTEND_HISTORY: JSON.stringify(config.apps.frontend.history),
        GITHUB_CLIENT_ID: JSON.stringify(config.github.token),
    });
}

export function extractTextPlugin(appName) {
    return new ExtractTextPlugin(`${appName}/[name].css`, {
        allChunks: false,
    });
}
