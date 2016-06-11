const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV;

switch (NODE_ENV) {
  case 'development': {
    return require('./hot.server')();
  }

  default: { // production
    const config = require('./webpack.config.production');
    const compiler = webpack(config);

    return compiler.run(function(err, stats) {
      if (err) throw err;

      console.log(stats.toString({
        colors : true,
        chunks : false
      }));
    });
  }
}
