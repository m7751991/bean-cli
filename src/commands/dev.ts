const { Command } = require("commander");
import chalk from "chalk";
const { startDevServer } = require("../webpack/startDevServer");

interface DevOptions {
  config?: string;
  port?: number;
  host?: string;
  open?: boolean;
  debug?: boolean;
  mode?: string;
}

function devCommand() {
  const command = new Command("dev");

  command
    .description("开发模式")
    .option("-c, --config <path>", "指定配置文件路径")
    .option("--mode <mode>", "设置环境模式", "development")
    .option("-p, --port <number>", "指定开发服务器端口", parseInt)
    .option("-o, --open", "自动打开浏览器")
    .option("--debug", "开启调试模式")
    .action(async (options: DevOptions) => {
      try {
        process.env.NODE_ENV = options.mode;
        await startDevServer(options);
      } catch (error: any) {
        console.error(chalk.red(`开发服务器启动失败: ${error?.message}`));
        process.exit(1);
      }
    });

  return command;
}

module.exports = {
  devCommand,
};
