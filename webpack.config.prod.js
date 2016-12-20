const path = require('path');
const webpack = require('webpack');
const pathCfg = require('./path.cfg');
const NODE_ENV = require('./env').NODE_ENV;
const TARGET = require('./env').TARGET;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  devtool: 'source-map',

  entry: ['./src/index.js'],

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
        'NODE_ENV': JSON.stringify(NODE_ENV.PRODUCTION),
      }
    }),
    new HtmlWebpackPlugin({
      template: `${pathCfg.projectPath}/index.html`,
      filename: 'index.html'
    }),
    new webpack.BannerPlugin({
      banner: '// ==UserScript==\n' +
        '// @name         big-bang\n' +
        '// @homepageURL  https://github.com/liximomo/bigbang-web\n' +
        '// @namespace    http://tampermonkey.net/\n' +
        '// @version      1.0.1\n' +
        '// @description  bigbang word segment and smart copy\n' +
        '// @author       liximomo\n' +
        '// @match        http*://*/*\n' +
        '// @run-at       document-end\n' +
        '// @grant        GM_xmlhttpRequest\n' +
        '// @grant        GM_setClipboard\n' +
        '// @connect      api.ltp-cloud.com\n' +
        '// ==/UserScript==\n',
      raw: true,
      entryOnly: true,
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     warnings: false,
    //     drop_console: false,
    //     drop_debugger: true,
    //   },
    //   sourceMap: true,
    // }),
  ],
};

module.exports = config;
