const fs = require("fs");
const ora = require("ora");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const { getWebpackConfig, getProjectRoot } = require("./index");
const { ConfigPrinter, logBuildAssets } = require("../utils/print");
const { resolveConfigPath, validateConfig } = require("./utils");
import type { Configuration, Stats, StatsError } from "webpack";

interface BuildOptions {
  config?: string; // 配置文件路径
  analyze?: boolean; // 是否开启打包分析
  debug?: boolean; // 是否开启调试模式
}

async function buildProject(options: BuildOptions) {
  // 1. 获取配置文件路径
  const configPath = resolveConfigPath(options.config);
  // 2. 获取webpack配置
  const config = await getWebpackConfig({
    mode: "production",
    configPath,
  });
  // 3. 验证配置
  validateConfig(config);
  // 4. 打印配置（调试模式下）
  if (options.debug) {
    ConfigPrinter.printWebpackConfig(config);
    const outputPath = path.resolve(getProjectRoot(), "webpack.config.debugfile.js");
    fs.writeFileSync(outputPath, `// This is a debug file generated by build command\nmodule.exports = ${JSON.stringify(config, null, 2)}`, "utf-8");
    console.log(chalk.gray(`Debug config has been written to ${outputPath}`));
  }
  // 5. 执行构建
  await runBuild(config);
}

function runBuild(config: Configuration): Promise<void> {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    // 开始构建
    const spinner = ora({
      text: chalk.cyan("正在构建项目..."),
      color: "cyan",
    }).start();

    const startTime = Date.now();
    compiler.run((err: Error | null, stats: Stats | undefined) => {
      // 停止 spinner
      spinner.stop();
      compiler.close((closeErr: Error | null) => {
        if (closeErr) {
          console.error(chalk.yellow("警告: Compiler 关闭时发生错误"), closeErr);
        }
      });

      if (err) {
        console.error(chalk.red("❌ 构建失败:"), err.message);
        reject(err);
        return;
      }

      if (!stats) {
        reject(new Error("没有生成构建统计信息"));
        return;
      }
      // 处理构建结果
      handleBuildResult(stats);
      // 检查构建是否有错误
      if (stats.hasErrors()) {
        reject(new Error("构建过程中发生错误"));
        return;
      }
      const endTime = Date.now();
      // 添加完成动画和信息
      console.log("\n" + chalk.green("✨ 构建成功！"), chalk.cyan("⏱️  构建用时：") + chalk.yellow(`${(endTime - startTime) / 1000}s`));
      resolve();
    });
  });
}

function handleBuildResult(stats: Stats): void {
  // 输出构建信息
  const statsOutput = stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    entrypoints: false,
  });

  // 输出警告和错误
  if (stats.hasWarnings()) {
    console.log(chalk.yellow("\n⚠️  构建警告:\n"));
    const info = stats.toJson();
    info.warnings?.forEach((warning: StatsError) => {
      console.log(chalk.yellow(warning.message || warning));
    });
  }

  if (stats.hasErrors()) {
    console.log(chalk.red("\n🚨 构建错误:\n"));
    const info = stats.toJson();
    info.errors?.forEach((error: StatsError) => {
      console.log(chalk.red(error.message || error));
    });
  }
  // 输出构建统计信息
  console.log(statsOutput);
  // 输出构建资源信息
  const info = stats.toJson({
    assets: true,
    chunks: false,
    modules: false,
  });
  logBuildAssets(info);
}

module.exports = {
  buildProject,
};
