const path = require('path');

const projectPath = __dirname;

const config = {
  projectPath,
  src: `${projectPath}/src`,
  output: `${projectPath}/dist`,
  public: '/bigbang-web/',
};

config.es6 = [
  config.src,
];

config.modules = [
  'node_modules',
];

module.exports = config;
