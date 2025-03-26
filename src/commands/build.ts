import commander = require("commander"); // 使用 TypeScript 的模块导入语法
const { buildProject } = require("../webpack/buildProject");
const chalk = require("chalk");

interface BuildOptions {
  config?: string; // 配置文件路径
  analyze?: boolean; // 是否开启打包分析
  debug?: boolean; // 是否开启调试模式
  mode?: string; // 环境模式
}

function buildCommand() {
  const command = new commander.Command("build");
  command
    .description("构建项目")
    .option("--mode <mode>", "设置环境模式", "production")
    .option("-c, --config <path>", "指定配置文件路径")
    .option("--analyze", "开启打包分析")
    .option("--debug", "开启调试模式")
    .action(async (options: BuildOptions) => {
      try {
        process.env.NODE_ENV = options.mode;
        await buildProject(options);
      } catch (error: any) {
        console.error(chalk.red(`构建失败: ${error.message}`));
        process.exit(1);
      }
    });

  return command;
}

module.exports = {
  buildCommand,
};
