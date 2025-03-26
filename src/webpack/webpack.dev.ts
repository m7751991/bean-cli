const { merge } = require("webpack-merge");
const webpack = require("webpack");
const { ConfigManager } = require("./utils");
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { Configuration } from "webpack";

interface BuildOptions {
  configPath?: string;
}

interface DevConfig extends Configuration {
  devServer: DevServerConfiguration;
}

async function createDevConfig(options: BuildOptions) {
  const { webpackConfig } = await ConfigManager.getProjectConfig(options.configPath);
  const devConfig: DevConfig = {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    devServer: {},
    optimization: {
      minimize: false,
      runtimeChunk: "single",
    },
    plugins: [],
  };

  return devConfig;
}

module.exports = createDevConfig;
