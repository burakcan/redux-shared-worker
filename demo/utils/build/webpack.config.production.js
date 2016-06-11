const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

const srcPath = baseConfig.__srcPath__;
const outPath = baseConfig.__outPath__;

module.exports = Object.assign(baseConfig, {
  debug: false,
  devtool: false,

  entry: Object.assign(baseConfig.entry, {
    main: [
      'babel-polyfill',
      path.join(srcPath, '/index.js')
    ],
  }),

  plugins: baseConfig.plugins.concat([
    extractCSS,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        unsafe: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        collapse_vars: true,
        negate_iife: true,
        pure_getters: true,
        drop_console: true,
      },
      'screw-ie8': true,
      mangle: true,
      stats: true,
    }),
  ]),
});
