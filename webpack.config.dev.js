const path = require('path');
const webpack = require('webpack');
const pathCfg = require('./path.cfg');
const NODE_ENV = require('./env').NODE_ENV;
const TARGET = require('./env').TARGET;

const config = {
  devtool: 'cheap-module-eval-source-map',

  performance: { hints: false },

  entry: ['webpack-hot-middleware/client?reload=true', './src/index.js'],

  output: {
    devtoolModuleFilenameTemplate: info => {
      if (!info.resourcePath) {
        return `${info.absoluteResourcePath}`;
      }
      return `webpack:///${info.resourcePath}?${info.loaders}`;
    },
    path: pathCfg.output,
    filename: "[name].js",
    publicPath: pathCfg.public
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: pathCfg.es6,
        use: ['babel-loader'],
      },
      {
        test: /\.s?css$/,
        include: [
          pathCfg.src
        ],
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },
    ],
  },

  resolve: {
    modules: pathCfg.modules,
    alias: {
      root: pathCfg.src,
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'TARGET': JSON.stringify(TARGET.BROWSER),
        'NODE_ENV': JSON.stringify(NODE_ENV.development),
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};

module.exports = config;
