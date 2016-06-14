const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const srcPath = path.join(__dirname, '../../src');
const outPath = path.join(__dirname, '../../dist');

module.exports = {
  __srcPath__: srcPath,
  __outPath__: outPath,

  publicPath: './',

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  entry: {},

  output: {
    path: outPath,
    filename: '[name].js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['', '.js'],
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
    ]),
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html',
      chunks: ['main'],
    }),
  ],

  externals: [],
};
