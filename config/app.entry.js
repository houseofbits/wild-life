const path = require('path');

module.exports = {
    entry: {
        'main': './app/src/main.ts',
    },
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve(__dirname, '../dist/'),
    },
};