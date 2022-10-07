module.exports = {
    entry: `./src/main.js`,
    mode: 'development',
    output: {
        path: `${__dirname}/dist`,
        filename: 'main.js',
    },
    devServer: {
        contentBase: 'dist',
        open: true,
    },
};