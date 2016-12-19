const Express = require('express');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const NODE_ENV = require('./env').NODE_ENV;
const isProd = process.env.NODE_ENV === NODE_ENV.PRODUCTION;

const webpackConfig = isProd ? require('./webpack.config.prod') : require('./webpack.config.dev');
const pathCfg = require('./path.cfg');

// Initialize the Express App
const app = new Express();

const compiler = webpack(webpackConfig);

if (isProd) {
  compiler.run(function(err, stats) {
    if(err) throw new Error("webpack", err);
    const jsonStats = stats.toJson();
    let log = stats.toString();
    console.log(log);
  });
} else {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true, 
    // colors: true,
    publicPath: pathCfg.public
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(pathCfg.public, Express.static(pathCfg.output));

app.use(Express.static(pathCfg.projectPath));

const port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', (error) => {
  if (error) {
    throw error;
  }
  console.log(`app is running on 0.0.0.0:${port}`);
});
