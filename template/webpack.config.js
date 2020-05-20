const path = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const packagejson = require("./package.json");
const pluginName = packagejson.name.replace(/-/g, "_");
const configjson = require("../settings.json")
const pluginPath = path.resolve(configjson.pluginsdir, pluginName)
console.log(pluginPath)

module.exports = (env, argv) => {
    let mode;

    // if user specified mode flag take that value
    if (argv && argv.mode) {
        mode = argv.mode;
    }
    // else take webpack default (production)
    else {
        mode = "production";
    }

    const entry = {
        main: argv && argv.entry ? argv.entry : "./src/index.tsx",
    };
    const demo = entry.main !== "./src/index.tsx";


    const devtool =
        argv.devtool || (mode === "development" ? "eval-source-map" : "none");


    return {
        watch:true,
        mode,
        entry,
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
        output: {
            path: demo ? __dirname : pluginPath,
            filename: "output.js",
        },
        optimization: {
            minimizer: [
                new TerserJSPlugin({}),
                new OptimizeCSSAssetsPlugin({}),
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "output.css",
            }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "**/*",
                    context: path.resolve(__dirname, "src", "assets"),
                },
            ],
        }),
        ],
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: { loader: "ts-loader" },
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        "css-loader",
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg)$/i,
                    use: [
                        {
                            loader: "url-loader",
                        },
                    ],
                },
                {
                    test: /\.(fs|vs).glsl$/i,
                    use: [
                        {
                            loader: "raw-loader",
                        },
                    ],
                },
                {
                    enforce: "pre",
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "source-map-loader",
                },
            ],
        },
        devtool,
    };
};
