const { getWebpackConfig, ConfigManager } = require("../webpack/index");
const { ConfigPrinter } = require("../utils/print");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const path = require("path");
const { getAvailablePort } = require("../utils/network");
const { setupCompilerHooks, startServer } = require("../utils/webpack");

import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

interface DevOptions {
  config?: string;
  port?: number;
  host?: string;
  open?: boolean;
  debug?: boolean;
  mode?: string;
}
async function startDevServer(options: DevOptions) {
  // 1. 获取webpack配置,内部会根据环境变量获取对应的配置
  const config = await getWebpackConfig({
    mode: "development",
    configPath: options.config,
  });
  // 2.devServer 开发服务器配置
  const { devServerConfig } = await ConfigManager.getProjectConfig(options.config);
  if (options.debug) {
    ConfigPrinter.printWebpackConfig(config);
  }
  // 3. 创建 compiler 实例
  const compiler = webpack(config);
  // 4. 获取可用端口
  const preferredPort = options.port || devServerConfig?.port || 3000;
  const host = options.host || devServerConfig?.host || "localhost";
  // 5. 获取可用端口
  const port = await getAvailablePort(preferredPort, host);

  // 6. 配置开发服务器选项
  const devServerOptions: DevServerConfiguration = {
    ...Object.assign(
      {
        host,
        port,
        hot: true,
        open: true,
        historyApiFallback: true,
        server: {
          type: "http",
        },
        static: {
          directory: path.join(process.cwd(), "public"),
          publicPath: "/",
        },
        client: {
          overlay: {
            errors: true,
            warnings: false,
          },
          progress: true,
        },
        devMiddleware: {
          stats: {
            errors: true,
            warnings: true,
            modules: false,
            chunks: false,
            assets: false,
          },
        },
      },
      devServerConfig || {}
    ),
  };

  // 7. 创建开发服务器实例
  const server = new WebpackDevServer(devServerOptions, compiler);
  // 8. 添加编译器钩子
  setupCompilerHooks(compiler, server);
  // 9. 启动服务器
  await startServer(server, devServerOptions);
}

module.exports = {
  startDevServer,
};
