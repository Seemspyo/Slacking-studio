const
path = require('path'),
CleanupPlugin = require('webpack-cleanup-plugin'),
webpack = require('webpack'),
DotEnv = require('dotenv-webpack');

module.exports = (env, options) => ({
    target: "node",
    mode: options.mode,
    entry: {
        http: './src/http.ts',
        app: './src/app.ts',
        blog: './src/blog.ts',
        playground: './src/playground.ts'
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
        new CleanupPlugin(),
        new webpack.ContextReplacementPlugin(/.*/),
        new DotEnv({ path: options.mode === 'production' ? './.prod.env' : './.env' })
    ]
});