'use strict';

const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PROD = JSON.parse(process.env.PROD_DEV || "0");
const path = require("path");
const sassLoaders = [
  "css-loader",
  "postcss-loader",
  "sass-loader?indentedSyntax=sass&includePaths[]=" + path.resolve(__dirname, "./src")
];

module.exports = {
  entry: {
    app: ['./src/index']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: [
            "react",
            "es2015"
          ]
        }
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract("style-loader", sassLoaders.join("!"))
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, "./dist")
  },
  plugins: (
    PROD ? [new webpack.optimize.UglifyJsPlugin({minimize: true})] : []).concat([
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      title: "StockCharts",
      template: "./src/html/template.html",
      inject: 'body'
    })
  ]),
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  resolve: {
    extensions: [
      '',
      '.js',
      '.sass'
    ],
    modulesDirectories: [
      'src',
      'node_modules'
    ]
  }
};
