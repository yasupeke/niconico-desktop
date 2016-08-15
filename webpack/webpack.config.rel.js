const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        "index": path.join(__dirname, '..', 'src', 'views', 'index.tsx'),
        "receive": path.join(__dirname, '..', 'src', 'views', 'receive.ts')
    },
    target: "node",
    resolve: {
        extensions: ['', '.tsx', '.ts', '.webpack.js', '.web.js', '.js']
    },
    output: {
        path: path.join(__dirname, '..', 'dist', 'views'),
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                exclude: /(node_modules)/,
                loaders: ["babel", "ts"]
            }
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
        ]),
        new webpack.DefinePlugin({
            "process.env": { 
                NODE_ENV: JSON.stringify("production") 
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    devtool: 'inline-source-map'
};