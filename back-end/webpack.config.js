const
path = require('path'),
cleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
    target: "node",
    mode: "none",
    entry: {
        http: './src/http.ts',
        app: './src/app.ts',
        blog: './src/blog.ts'
    },
    output: {
        filename: `[name].js`,
        path: path.resolve(__dirname, 'dist')
    },
    node: {
        __dirname: false
    },
    resolve: {
        extensions: [ '.ts', '.js' ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new cleanupPlugin()
    ]
}