'use strict';

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const PROD = JSON.parse(process.env.PROD_DEV || '0');
const path = require('path');

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  `sass-loader?indentedSyntax=sass&includePaths[]=${path.resolve(__dirname, './src')}`,
];

module.exports = {
  entry: {
    app: ['./src/index'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: [
            'react',
            'es2015',
          ],
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url?prefix=font/&limit=5000',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml',
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!')),
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist'),
  },
  plugins: (PROD ? [
    {
      optimization: {
        minimizer: [
          new UglifyJSPlugin({
            uglifyOptions: {
              output: {
                comments: false,
              },
              compress: {
                drop_console: true,
              },
            },
          }),
        ],
      },
    },
  ] : []).concat([
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      title: 'StockCharts',
      template: './src/html/template.html',
      inject: 'body',
    }),
    new webpack.LoaderOptionsPlugin({
      // test: /\.xxx$/, // may apply this only for some modules
      options: {
        postcss: [
          autoprefixer({
            browsers: ['last 2 versions'],
          }),
        ]
      }
    }),
  ]),
  resolve: {
    extensions: [
      '',
      '.js',
      '.sass',
    ],
    modulesDirectories: [
      'src',
      'node_modules',
    ],
  },
};
