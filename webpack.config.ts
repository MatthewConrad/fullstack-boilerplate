import path from "path";
import webpack from "webpack";

const config: webpack.Configuration = {
    entry: path.resolve(__dirname, "src/client/index.tsx"),
    target: "web",
    mode: "development",
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "build/static"),
        filename: "bundle.js",
    },
};

export default config;
