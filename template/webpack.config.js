const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const distpath = path.resolve(__dirname, "../../rmsplugins/xsections_webpack");

module.exports = {
    watch: true,
    entry: "./src/app.js",
    output: {
        filename: "bundle.js",
        path: distpath,
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader: "style-loader",
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: "css-loader",
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: "postcss-loader",
                        options: {
                            plugins: function () {
                                return [require("autoprefixer")];
                            },
                        },
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: "sass-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "**/*",
                    context: path.resolve(__dirname, "src", "include"),
                },
            ],
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            title: "Test",
        }),
    ],
};
