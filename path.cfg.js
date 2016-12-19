const path = require('path');

const projectPath = __dirname;

const config = {
  projectPath,
  src: `${projectPath}/src`,
  output: `${projectPath}/dist`,
  public: '/static/',
};

config.es6 = [
  config.src,
];

config.modules = [
  'node_modules',
];

module.exports = config;
