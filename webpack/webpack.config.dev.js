const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        "index": path.join(__dirname, '..', 'src', 'views', 'index.tsx'),
        "receive": path.join(__dirname, '..', 'src', 'views', 'receive.ts')
    },
    target: "node",
    resolve: {
        extensions: ['', '.tsx', '.ts', '.js']
    },
    output: {
        path: path.join(__dirname, '..', 'dist', 'views'),
        filename: '[name].js',
    },
    module: {
        loaders: [
            { test: /\.ts(x?)$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        new webpack.ExternalsPlugin('commonjs', [
            'http',
            'fs',
            'electron',
            'app',
            'BrowserWindow',
            'ipcMain'
        ])
    ],
    devtool: 'inline-source-map'
};