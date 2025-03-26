const build = require("./build");
const dev = require("./dev");
const init = require("./init");

module.exports = {
  buildCommand: build.buildCommand,
  devCommand: dev.devCommand,
  initCommand: init.initCommand,
};
