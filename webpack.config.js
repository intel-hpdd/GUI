/* eslint-env node */

const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const pathsToClean = ["targetdir/index.html", "targetdir/main.*"];

const cleanOptions = {
  root: __dirname,
  watch: true
};

const config = {
  devtool: "source-map",
  target: "web",
  entry: "./source/iml/iml-module.js",
  node: {
    setImmediate: false
  },
  output: {
    publicPath: "/gui/",
    path: path.resolve(__dirname, "targetdir"),
    filename: "[name].[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=1000&mimetype=application/font-woff&name=/gui/[hash].[ext]"
      },
      {
        test: /\.ico$/,
        loader: "file-loader?name=/[name].[ext]"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=/gui/[hash].[ext]"
      },
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules\/angular|node_modules\/nvd3\/build|node_modules\/d3)|node_modules\/lodash/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["last 1 chrome version", "last 1 firefox version"]
                  },
                  modules: false,
                  forceAllTransforms: process.env.NODE_ENV === "production"
                }
              ]
            ],
            plugins: [
              ["@babel/plugin-transform-spread", { useBuiltIns: true }],
              "@babel/plugin-transform-flow-strip-types",
              "@babel/proposal-class-properties",
              "@babel/plugin-syntax-jsx",
              "inferno",
              [
                "angularjs-annotate",
                {
                  explicitOnly: true
                }
              ]
            ],
            babelrc: false
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: "index.ejs"
    }),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css"
    })
  ],
  mode: process.env.NODE_ENV
};

if (process.env.NODE_ENV === "production")
  config.module.rules.push({
    test: /\.less$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader"
      },
      {
        loader: "less-loader"
      }
    ]
  });
else
  config.module.rules.push({
    test: /\.less$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: "style-loader" // creates style nodes from JS strings
      },
      {
        loader: "css-loader" // translates CSS into CommonJS
      },
      {
        loader: "less-loader" // compiles Less to CSS
      }
    ]
  });

module.exports = config;
