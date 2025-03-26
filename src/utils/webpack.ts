const WebpackDevServer = require("webpack-dev-server");
const chalk = require("chalk");
const path = require("path");
const { getLocalIP } = require("./network");
import type { Compiler, Stats } from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

/**
 * 启动开发服务器
 */
async function startServer(server: typeof WebpackDevServer, config: DevServerConfiguration): Promise<void> {
  try {
    console.log(chalk.cyan("\n正在启动开发服务器...\n"));
    await server.start();
  } catch (error: any) {
    console.error(chalk.red(`\n开发服务器启动失败: ${error.message}\n`));
    throw error;
  }
}

/**
 * 打印服务器信息
 */
function printServerInfo(server: typeof WebpackDevServer) {
  const config = server.options || {};
  const protocol = config.server.type || "http";
  const host = config.host || "localhost";
  const port = config.port;
  if (!port) {
    return;
  }

  console.log(chalk.cyan("  开发服务器地址:\n"));
  console.log(`  > Local:    ${chalk.cyan(`${protocol}://${host}:${port}`)}`);
  if (host === "localhost" || host === "127.0.0.1") {
    const networkUrl = `${protocol}://${getLocalIP()}:${port}`;
    console.log(`  > Network:  ${chalk.cyan(networkUrl)}`);
  }
  console.log("\n  注意: 按 Ctrl+C 停止服务\n");
}

/**
 * 设置Webpack编译器钩子
 */
function setupCompilerHooks(compiler: Compiler, server: typeof WebpackDevServer) {
  let isFirstCompile = true;
  const startTime = Date.now();

  compiler.hooks.invalid.tap("dev-server", (fileName: string | null) => {
    console.log(chalk.cyan("\n正在重新编译..."));
    if (fileName) {
      console.log(chalk.gray(`触发文件: ${path.relative(process.cwd(), fileName)}`));
    }
  });

  compiler.hooks.done.tap("dev-server", (stats: Stats) => {
    const time = Date.now() - startTime;

    if (stats.hasErrors()) {
      const info = stats.toJson();
      console.log(chalk.red("\n编译失败!\n"));
      info.errors?.forEach((error: any) => {
        console.log(chalk.red(error.message || error));
      });
      return;
    }

    if (stats.hasWarnings()) {
      const info = stats.toJson();
      console.log(chalk.yellow("\n编译警告:\n"));
      info.warnings?.forEach((warning: any) => {
        console.log(chalk.yellow(warning.message || warning));
      });
    }

    if (isFirstCompile) {
      isFirstCompile = false;
      console.log(chalk.green(`\n✨ 开发服务器启动成功! (${(time / 1000).toFixed(2)}s)\n`));
      printServerInfo(server);
    } else {
      console.log(chalk.green(`\n✨ 热更新完成! (${(time / 1000).toFixed(2)}s)\n`));
    }
  });
}

module.exports = {
  setupCompilerHooks,
  printServerInfo,
  startServer,
};
