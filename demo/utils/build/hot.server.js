const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config.development');
const historyApiFallback = require('connect-history-api-fallback');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

module.exports = function(options) {
  options = options || {};

  const PORT = options.port || 3000;
  const app = express();
  const compiler = webpack(config);

  app.use(historyApiFallback());

  app.use(devMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      chunks: false,
    }
  }));

  app.use(hotMiddleware(compiler));

  app.listen(PORT, 'localhost', err => {
    if (err) throw err;

    console.log(`Listening at http://localhost:${PORT}`);
  });
}
